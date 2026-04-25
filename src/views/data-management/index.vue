<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import {
  ElSelect,
  ElOption,
  ElTable,
  ElTableColumn,
  ElButton,
  ElPagination,
  ElUpload,
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElImage,
  ElMessageBox,
  ElTag,
  ElRadioGroup,
  ElRadioButton
} from "element-plus"
import {
  getFileListApi,
  uploadFileApi,
  downloadFileApi,
  getPreviewImageApi,
  DbType,
  deleteFileApi
} from "@/api/dataManagement"
import { getPrivateProjectsApi, getSharedProjectsApi } from "@/api/projectManagement"
import type { Project } from "@/api/projectManagement/types"
import type { FileItem } from "@/api/dataManagement/types/file"
import { formatBytes } from "@/utils/format"
import { formatDateTime } from "@/utils/format"

type ProjectScope = "shared" | "private"

const FIXED_DB_TYPE = DbType.SimulationResult

const projectScope = ref<ProjectScope>("shared")
const projects = ref<Project[]>([])
const selectedProjectId = ref<number | undefined>(undefined)

const fileList = ref<FileItem[]>([])
const totalFiles = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const isLoading = ref(false)
const searchKeyword = ref("")
let fileRequestSeq = 0

const showUploadDialog = ref(false)
const uploadForm = reactive({
  fileName: "",
  file: null as File | null,
  previewImage: null as File | null
})

const showPreviewDialog = ref(false)
const previewLoading = ref(false)
const previewImageUrl = ref("")
const previewTitle = ref("")
const PREVIEW_IMAGE_MAX_SIZE = 10 * 1024 * 1024
const PREVIEW_IMAGE_ACCEPT_TYPES = ["image/jpeg", "image/png", "image/webp"]

const getSelectedProject = () => projects.value.find((p) => p.projectId === selectedProjectId.value) || null

const normalizeFileRows = (records: FileItem[]) => {
  const currentProject = getSelectedProject()
  return records.map((row) => ({
    ...row,
    projectName: currentProject?.project_name || `项目-${row.projectId}`,
    projectType: projectScope.value
  }))
}

const fetchProjects = async () => {
  try {
    const params = { pageNum: 1, pageSize: 200, keyword: "" }
    const response =
      projectScope.value === "shared" ? await getSharedProjectsApi(params) : await getPrivateProjectsApi(params)

    projects.value = response.data?.records || []
    selectedProjectId.value = projects.value.length > 0 ? projects.value[0].projectId : undefined
  } catch (error) {
    projects.value = []
    selectedProjectId.value = undefined
    ElMessage.error("获取项目列表失败")
    console.error("获取项目列表失败:", error)
  }
}

const fetchFiles = async () => {
  const requestSeq = ++fileRequestSeq

  if (!selectedProjectId.value) {
    fileList.value = []
    totalFiles.value = 0
    return
  }

  isLoading.value = true
  try {
    const response = await getFileListApi({
      dbType: FIXED_DB_TYPE,
      projectId: selectedProjectId.value,
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    })

    if (requestSeq !== fileRequestSeq) return

    if (response.code === 200) {
      const rawRecords = response.data.records || []
      const safeRecords = rawRecords.filter((row) => row.projectId === selectedProjectId.value)

      // 后端若混回了其他项目的数据，这里直接拦截并给出调试信号
      if (safeRecords.length !== rawRecords.length) {
        console.warn("[data-management] 检测到跨项目数据，可能后端未按projectId正确过滤", {
          projectScope: projectScope.value,
          selectedProjectId: selectedProjectId.value,
          returnedProjectIds: [...new Set(rawRecords.map((item) => item.projectId))]
        })
        ElMessage.warning("检测到接口返回了其他项目数据，已自动过滤")
      }

      fileList.value = normalizeFileRows(safeRecords)
      totalFiles.value = response.data.total
    } else {
      fileList.value = []
      totalFiles.value = 0
      ElMessage.error(`获取文件列表失败: ${response.message || "未知错误"}`)
    }
  } catch (error: any) {
    if (requestSeq !== fileRequestSeq) return

    fileList.value = []
    totalFiles.value = 0
    const msg = error?.response?.data?.message || error?.message || "未知网络错误"
    ElMessage.error(`获取文件列表失败: ${msg}`)
    console.error("获取文件列表失败:", error)
  } finally {
    if (requestSeq === fileRequestSeq) {
      isLoading.value = false
    }
  }
}

const handleScopeChange = async () => {
  // 先清空当前列表，避免切换分区时短暂显示上一个分区的数据
  fileList.value = []
  totalFiles.value = 0

  currentPage.value = 1
  searchKeyword.value = ""
  await fetchProjects()
  await fetchFiles()
}

const handleProjectChange = () => {
  fileList.value = []
  totalFiles.value = 0
  currentPage.value = 1
  fetchFiles()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchFiles()
}

const handleSearch = () => {
  currentPage.value = 1
  fetchFiles()
}

const resetSearch = () => {
  searchKeyword.value = ""
  currentPage.value = 1
  fetchFiles()
}

const downloadFile = async (row: FileItem) => {
  try {
    const response = await downloadFileApi({
      dbType: FIXED_DB_TYPE,
      field: row.id,
      projectId: row.projectId
    })

    const blob = response.data
    const disposition = response.headers["content-disposition"]

    let fileName = row.fileName || `file_${row.id}.dat`
    if (disposition) {
      const match = disposition.match(/filename\*=UTF-8''(.+)/)
      if (match && match[1]) {
        fileName = decodeURIComponent(match[1])
      } else {
        const fallbackMatch = disposition.match(/filename="?([^"]+)"?/)
        if (fallbackMatch && fallbackMatch[1]) {
          fileName = fallbackMatch[1]
        }
      }
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error: any) {
    ElMessage.error(`下载失败: ${error?.message || "未知错误"}`)
  }
}

const deleteFile = async (row: FileItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除文件"${row.fileName}"吗？此操作不可撤销。`, "删除确认", {
      confirmButtonText: "确认删除",
      cancelButtonText: "取消",
      type: "warning"
    })

    const response = await deleteFileApi({
      dbType: FIXED_DB_TYPE,
      fileId: row.id,
      projectId: row.projectId
    })

    if (response.code === 200) {
      ElMessage.success(`文件"${row.fileName}"删除成功`)
      fetchFiles()
    } else {
      ElMessage.error(`删除失败: ${response.message || "未知错误"}`)
    }
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(`操作失败: ${error?.message || "系统异常"}`)
    }
  }
}

const openUploadDialog = () => {
  if (!selectedProjectId.value) {
    ElMessage.warning("请先选择项目")
    return
  }
  showUploadDialog.value = true
}

const handleFileChange = (file: File) => {
  uploadForm.file = file
  if (!uploadForm.fileName) {
    uploadForm.fileName = file.name.replace(/\.[^/.]+$/, "")
  }
}

const handlePreviewImageChange = (file: File) => {
  if (!PREVIEW_IMAGE_ACCEPT_TYPES.includes(file.type)) {
    ElMessage.warning("预览图格式仅支持 JPG/PNG/WEBP")
    uploadForm.previewImage = null
    return
  }
  if (file.size > PREVIEW_IMAGE_MAX_SIZE) {
    ElMessage.warning("预览图不能超过 10MB")
    uploadForm.previewImage = null
    return
  }
  uploadForm.previewImage = file
}

const resetUploadForm = () => {
  uploadForm.fileName = ""
  uploadForm.file = null
  uploadForm.previewImage = null
}

const clearPreviewBlobUrl = () => {
  if (previewImageUrl.value) {
    URL.revokeObjectURL(previewImageUrl.value)
    previewImageUrl.value = ""
  }
}

const closePreviewDialog = () => {
  showPreviewDialog.value = false
  previewLoading.value = false
  previewTitle.value = ""
  clearPreviewBlobUrl()
}

const parseBlobErrorMessage = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    if (!(blob instanceof Blob) || blob.type !== "application/json") {
      resolve("")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const errorData = JSON.parse(reader.result as string)
        resolve(errorData?.message || errorData?.msg || "")
      } catch {
        resolve("")
      }
    }
    reader.onerror = () => resolve("")
    reader.readAsText(blob)
  })
}

const previewFileImage = async (row: FileItem) => {
  if (!row?.hasPreview) {
    ElMessage.info("该文件暂无预览图")
    return
  }

  previewLoading.value = true
  previewTitle.value = row.fileName || "预览图片"
  showPreviewDialog.value = true
  clearPreviewBlobUrl()

  try {
    const response = await getPreviewImageApi({
      dbType: FIXED_DB_TYPE,
      fileId: row.id,
      projectId: row.projectId
    })

    const blob = response.data
    if (!(blob instanceof Blob) || blob.size === 0) {
      throw new Error("未获取到预览图片")
    }
    previewImageUrl.value = URL.createObjectURL(blob)
  } catch (error: any) {
    let errorMessage = error.message || "获取预览图片失败"
    if (error.response?.data instanceof Blob) {
      const blobMessage = await parseBlobErrorMessage(error.response.data)
      if (blobMessage) {
        errorMessage = blobMessage
      }
    }
    ElMessage.error(errorMessage)
    closePreviewDialog()
  } finally {
    previewLoading.value = false
  }
}

const submitUpload = async () => {
  if (!uploadForm.file || !uploadForm.fileName) {
    ElMessage.warning("请选择文件并填写文件名")
    return
  }

  if (!selectedProjectId.value) {
    ElMessage.warning("请选择项目")
    return
  }

  if (uploadForm.previewImage) {
    if (!PREVIEW_IMAGE_ACCEPT_TYPES.includes(uploadForm.previewImage.type)) {
      ElMessage.warning("预览图格式仅支持 JPG/PNG/WEBP")
      return
    }
    if (uploadForm.previewImage.size > PREVIEW_IMAGE_MAX_SIZE) {
      ElMessage.warning("预览图不能超过 10MB")
      return
    }
  }

  isLoading.value = true
  try {
    const formData = new FormData()
    formData.append("dbType", FIXED_DB_TYPE)
    formData.append("fileName", uploadForm.fileName)
    formData.append("projectId", String(selectedProjectId.value))
    formData.append("file", uploadForm.file)
    if (uploadForm.previewImage) {
      formData.append("previewImage", uploadForm.previewImage)
    }

    const response = await uploadFileApi(formData)
    if (response.code === 200) {
      ElMessage.success("文件上传成功")
      showUploadDialog.value = false
      resetUploadForm()
      currentPage.value = 1
      fetchFiles()
    } else {
      ElMessage.error(`文件上传失败: ${response.message || "未知错误"}`)
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "文件上传时发生未知错误"
    ElMessage.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchProjects()
  await fetchFiles()
})
</script>

<template>
  <div class="data-management-container">
    <div class="preview-tip">提示：请预先截取一张具有代表性的仿真图片，作为预览图进行上传。</div>
    <div class="top-bar">
      <el-radio-group v-model="projectScope" @change="handleScopeChange">
        <el-radio-button label="shared">公开项目</el-radio-button>
        <el-radio-button label="private">私有项目</el-radio-button>
      </el-radio-group>

      <el-select
        v-model="selectedProjectId"
        placeholder="请选择项目"
        filterable
        clearable
        style="min-width: 260px"
        @change="handleProjectChange"
      >
        <el-option v-for="proj in projects" :key="proj.projectId" :label="proj.project_name" :value="proj.projectId" />
      </el-select>

      <div class="search-container">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入文件名关键词搜索"
          clearable
          @keydown.enter="handleSearch"
          @clear="resetSearch"
        >
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <el-button type="primary" @click="openUploadDialog">上传文件</el-button>
    </div>

    <el-table :data="fileList" :style="{ width: '100%' }" v-loading="isLoading">
      <el-table-column prop="fileName" label="文件名" min-width="200" />
      <el-table-column label="项目" width="180">
        <template #default="{ row }">
          <span>{{ row.projectName || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" width="110" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.projectType === 'private'" type="warning" size="small">🔒 私有</el-tag>
          <el-tag v-else type="info" size="small">🌐 公开</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="120">
        <template #default="{ row }">
          {{ formatBytes(row.fileSize) }}
        </template>
      </el-table-column>
      <el-table-column label="上传时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="预览" width="110">
        <template #default="{ row }">
          <el-button v-if="row.hasPreview" type="primary" link @click="previewFileImage(row)">预览</el-button>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="downloadFile(row)">下载</el-button>
          <el-button type="danger" size="small" @click="deleteFile(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      :total="totalFiles"
      :current-page="currentPage"
      :page-size="pageSize"
      @current-change="handlePageChange"
      class="pagination"
      :disabled="isLoading"
    />

    <el-dialog v-model="showUploadDialog" title="上传文件" width="500px" @close="resetUploadForm">
      <el-form :model="uploadForm" label-width="90px">
        <el-form-item label="项目">
          <div>{{ getSelectedProject()?.project_name || "-" }}</div>
        </el-form-item>

        <el-form-item label="文件名" required>
          <el-input v-model="uploadForm.fileName" placeholder="请输入文件名" />
        </el-form-item>

        <el-form-item label="选择文件" required>
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="(file) => file.raw && handleFileChange(file.raw)"
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <div class="file-info" v-if="uploadForm.file">
              {{ uploadForm.file.name }} ({{ (uploadForm.file.size / 1024).toFixed(2) }}KB)
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="预览图">
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            :show-file-list="false"
            accept="image/png,image/jpeg,image/webp"
            :on-change="(file) => file.raw && handlePreviewImageChange(file.raw)"
          >
            <template #trigger>
              <el-button>选择预览图</el-button>
            </template>
            <div class="file-info" v-if="uploadForm.previewImage">
              {{ uploadForm.previewImage.name }} ({{ (uploadForm.previewImage.size / 1024).toFixed(2) }}KB)
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="(showUploadDialog = false), resetUploadForm()">取消</el-button>
        <el-button type="primary" @click="submitUpload">上传</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showPreviewDialog" :title="`${previewTitle} - 预览`" width="720px" @close="closePreviewDialog">
      <div class="preview-content" v-loading="previewLoading">
        <el-image v-if="previewImageUrl" :src="previewImageUrl" fit="contain" class="preview-image" />
        <el-empty v-else-if="!previewLoading" description="暂无可预览图片" :image-size="100" />
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.preview-tip {
  margin-bottom: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ffe58f;
  background: #fffbe6;
  color: #8c6d1f;
  font-size: 13px;
}

.data-management-container {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-container {
  min-width: 260px;
  flex: 1;
}

.pagination {
  margin-top: 20px;
  justify-content: center;
}

.file-info {
  margin-top: 10px;
  font-size: 12px;
  color: #666;
  padding: 5px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.preview-content {
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  width: 100%;
  max-height: 65vh;
}
</style>
