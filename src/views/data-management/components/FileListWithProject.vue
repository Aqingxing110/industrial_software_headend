<template>
  <div class="file-list-with-project">
    <!-- 项目选择器 -->
    <div class="filter-bar">
      <el-select
        v-model="selectedProjectId"
        placeholder="选择项目"
        clearable
        style="width: 300px"
        @change="handleProjectChange"
      >
        <el-option key="all" label="所有项目" :value="undefined" />
        <el-option
          v-for="proj in projects"
          :key="proj.projectId"
          :label="`${proj.project_name} (${getProjectTypeName(proj)})`"
          :value="proj.projectId"
        />
      </el-select>

      <el-button type="primary" @click="showProjectSelector = true">
        <el-icon><Plus /></el-icon>
        上传文件
      </el-button>
    </div>

    <!-- 文件列表 -->
    <el-table
      v-loading="loading"
      :data="paginatedFiles"
      stripe
      style="width: 100%; margin-top: 20px"
      @row-dblclick="handlePreview"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="fileName" label="文件名" min-width="200" show-overflow-tooltip />
      <el-table-column prop="projectName" label="项目" width="150">
        <template #default="{ row }">
          <span>{{ row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" width="100" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.projectType === 'private'" type="warning" size="small">
            🔒 私有
          </el-tag>
          <el-tag v-else type="info" size="small">
            🌐 共享
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="fileSize" label="大小" width="100" />
      <el-table-column prop="updateTime" label="更新时间" width="180" />
      <el-table-column v-if="dbType === DbType.SimulationResult" label="预览" width="80" align="center">
        <template #default="{ row }">
          <el-button
            v-if="row.hasPreview"
            link
            type="primary"
            size="small"
            @click="handlePreview(row)"
          >
            查看
          </el-button>
          <span v-else class="text-gray">-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleDownload(row)">
            下载
          </el-button>
          <el-button link type="primary" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定要删除此文件吗？"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button link type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="filteredFiles.length"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px; text-align: right"
    />

    <!-- 项目选择器 -->
    <ProjectSelector
      v-model="showProjectSelector"
      :selected-project-id="selectedProjectId"
      @select="handleSelectProject"
    />

    <!-- 编辑文件对话框 -->
    <el-dialog v-model="showEditDialog" title="编辑文件" width="400px">
      <el-form ref="editFormRef" :model="editFormData" label-width="100px">
        <el-form-item label="文件名" prop="fileName">
          <el-input v-model="editFormData.fileName" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="editFormData.description"
            type="textarea"
            :rows="4"
            placeholder="输入文件描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" :loading="updating" @click="handleUpdateFile">
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 预览图对话框 -->
    <el-dialog v-model="showPreviewDialog" title="图片预览" width="800px" center>
      <img
        :src="previewImageUrl"
        style="width: 100%; max-height: 600px; object-fit: contain"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { ElMessage } from "element-plus"
import { Plus } from "@element-plus/icons-vue"
import ProjectSelector from "@/components/ProjectSelector/index.vue"
import {
  getFileListApi,
  downloadFileApi,
  getPreviewImageApi,
  deleteFileApi,
  updateFileApi,
  DbType,
  uploadFileStreamApi
} from "@/api/dataManagement"
import { getAccessibleProjectsApi } from "@/api/projectManagement"
import type { FileItem } from "@/api/dataManagement/types/file"
import type { Project } from "@/api/projectManagement/types"

interface Props {
  dbType?: DbType
}

const props = withDefaults(defineProps<Props>(), {
  dbType: () => DbType.SimulationResult
})

// 数据
const files = ref<FileItem[]>([])
const projects = ref<Project[]>([])
const selectedProjectId = ref<number | undefined>(undefined)
const loading = ref(false)
const updating = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const searchKeyword = ref("")

const showProjectSelector = ref(false)
const showEditDialog = ref(false)
const showPreviewDialog = ref(false)
const editingFile = ref<FileItem | null>(null)
const previewImageUrl = ref("")

const editFormData = ref({
  fileName: "",
  description: ""
})

// 计算属性
const filteredFiles = computed(() => {
  let result = files.value

  // 按项目过滤
  if (selectedProjectId.value !== undefined) {
    result = result.filter((f) => f.projectId === selectedProjectId.value)
  }

  // 按关键词过滤
  if (searchKeyword.value) {
    result = result.filter((f) =>
      f.fileName.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  return result
})

const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredFiles.value.slice(start, end)
})

// 方法
const getProjectTypeName = (project: Project) => {
  if (project.organization) {
    return "共享"
  }
  return "私有"
}

const fetchProjects = async () => {
  try {
    const response = await getAccessibleProjectsApi({
      pageNum: 1,
      pageSize: 100,
      keyword: ""
    })
    if (response.data) {
      projects.value = response.data.records
    }
  } catch (error) {
    console.error("获取项目列表失败:", error)
  }
}

const fetchFiles = async () => {
  if (!selectedProjectId.value) {
    // 获取所有可访问项目的文件
    const promises = projects.value.map((proj) =>
      getFileListApi({
        dbType: props.dbType,
        projectId: proj.projectId,
        pageNum: 1,
        pageSize: 1000,
        keyword: searchKeyword.value
      })
    )
    try {
      loading.value = true
      const results = await Promise.all(promises)
      files.value = results.flatMap((res) => res.data?.records || [])
    } catch (error) {
      console.error("获取文件列表失败:", error)
      ElMessage.error("获取文件列表失败")
    } finally {
      loading.value = false
    }
  } else {
    // 获取特定项目的文件
    try {
      loading.value = true
      const response = await getFileListApi({
        dbType: props.dbType,
        projectId: selectedProjectId.value,
        pageNum: 1,
        pageSize: 1000,
        keyword: searchKeyword.value
      })
      files.value = response.data?.records || []
    } catch (error) {
      console.error("获取文件列表失败:", error)
      ElMessage.error("获取文件列表失败")
    } finally {
      loading.value = false
    }
  }
}

const handleProjectChange = () => {
  currentPage.value = 1
  fetchFiles()
}

const handleSelectProject = async (project: Project) => {
  selectedProjectId.value = project.projectId
  // 这里可以触发上传逻辑，但具体上传由父组件处理
  ElMessage.success(`已选择项目：${project.project_name}`)
}

const handleDownload = async (file: FileItem) => {
  try {
    const response = await downloadFileApi({
      dbType: props.dbType,
      field: file.id,
      projectId: file.projectId
    })
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", file.fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("下载文件失败:", error)
    ElMessage.error("下载文件失败")
  }
}

const handlePreview = async (file: FileItem) => {
  if (!file.hasPreview) {
    ElMessage.warning("该文件没有预览图")
    return
  }

  try {
    const response = await getPreviewImageApi({
      dbType: props.dbType,
      fileId: file.id,
      projectId: file.projectId
    })
    previewImageUrl.value = window.URL.createObjectURL(response.data)
    showPreviewDialog.value = true
  } catch (error) {
    console.error("获取预览图失败:", error)
    ElMessage.error("获取预览图失败")
  }
}

const handleEdit = (file: FileItem) => {
  editingFile.value = file
  editFormData.value = {
    fileName: file.fileName,
    description: file.description || ""
  }
  showEditDialog.value = true
}

const handleUpdateFile = async () => {
  if (!editingFile.value) return

  try {
    updating.value = true
    await updateFileApi(editingFile.value.id, editFormData.value, editingFile.value.projectId)
    ElMessage.success("文件已更新")
    showEditDialog.value = false
    editingFile.value = null
    await fetchFiles()
  } catch (error: any) {
    console.error("更新文件失败:", error)
    ElMessage.error(error?.response?.data?.message || "更新文件失败")
  } finally {
    updating.value = false
  }
}

const handleDelete = async (file: FileItem) => {
  try {
    await deleteFileApi({
      dbType: props.dbType,
      fileId: file.id,
      projectId: file.projectId
    })
    ElMessage.success("文件已删除")
    await fetchFiles()
  } catch (error: any) {
    console.error("删除文件失败:", error)
    ElMessage.error(error?.response?.data?.message || "删除文件失败")
  }
}

// 初始化
onMounted(() => {
  fetchProjects()
  fetchFiles()
})
</script>

<style scoped lang="scss">
.file-list-with-project {
  padding: 20px;

  .filter-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    align-items: center;
  }

  .text-gray {
    color: #909399;
  }
}
</style>
