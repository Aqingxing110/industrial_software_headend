<template>
  <div class="project-manager">
    <!-- 搜索和创建按钮 -->
    <div class="header">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索项目名称"
        style="width: 300px"
        clearable
        @input="currentPage = 1"
      />
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        新建项目
      </el-button>
    </div>

    <!-- 项目列表 -->
    <el-table
      v-loading="loading"
      :data="filteredProjects"
      stripe
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="project_name" label="项目名称" min-width="150" />
      <el-table-column prop="simulationType" label="仿真类型" min-width="140">
        <template #default="{ row }">
          {{ row.simulationType || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="项目类型" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="getProjectType(row).type">
            {{ getProjectType(row).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="创建人" width="120" />
      <el-table-column label="组织" width="150">
        <template #default="{ row }">
          {{ row.organization || "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="creation_time" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template #default="{ row }">
          <!-- 转为私有 -->
          <el-button
            v-if="row.organization"
            link
            type="primary"
            size="small"
            @click="handleEncrypt(row)"
          >
            转为私有
          </el-button>
          <!-- 转为共享 -->
          <el-button
            v-else
            link
            :type="row.canShare ? 'primary' : 'info'"
            size="small"
            :disabled="!row.canShare"
            @click="handleDecrypt(row)"
          >
            {{ row.canShare ? "转为共享" : "无组织" }}
          </el-button>

          <!-- 删除 -->
          <el-popconfirm
            title="确定要删除此项目吗？"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button link type="danger" size="small"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50]"
      :total="filteredProjects.length"
      layout="total, sizes, prev, pager, next"
      style="margin-top: 20px; text-align: right"
    />

    <!-- 创建项目对话框 -->
    <el-dialog v-model="showCreateDialog" title="创建新项目" width="400px">
      <el-form ref="formRef" :model="formData" label-width="100px">
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="formData.projectName"
            placeholder="请输入项目名称"
            @keyup.enter="handleCreateProject"
          />
        </el-form-item>
        <el-form-item label="仿真类型" prop="simulationType">
          <el-select v-model="formData.simulationType" placeholder="请选择仿真类型" style="width: 100%">
            <el-option v-for="item in simulationTypeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
          <el-radio-group v-model="formData.projectType">
            <el-radio label="private">私有</el-radio>
            <el-radio label="shared">共享</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" :loading="creating" @click="handleCreateProject">
          创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { ElMessage, ElMessageBox, ElSelect, ElOption } from "element-plus"
import { Plus } from "@element-plus/icons-vue"
import { SIMULATION_TYPE_OPTIONS } from "@/api/projectManagement/types"
import {
  getAccessibleProjectsApi,
  createPrivateProjectApi,
  createSharedProjectApi,
  encryptProjectApi,
  decryptProjectApi,
  deleteProjectApi
} from "@/api/projectManagement"
import type { Project } from "@/api/projectManagement/types"

// 数据
const projects = ref<Project[]>([])
const searchKeyword = ref("")
const loading = ref(false)
const creating = ref(false)
const showCreateDialog = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const formData = ref({
  projectName: "",
  simulationType: SIMULATION_TYPE_OPTIONS[0],
  projectType: "private" as "private" | "shared"
})

const simulationTypeOptions = SIMULATION_TYPE_OPTIONS

// 计算属性
const filteredProjects = computed(() => {
  return projects.value.filter((p) =>
    p.project_name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProjects.value.slice(start, end)
})

// 方法
const getProjectType = (project: Project) => {
  if (project.organization) {
    return { type: "info", label: "🌐 共享" }
  }
  return { type: "warning", label: "🔒 私有" }
}

const fetchProjects = async () => {
  try {
    loading.value = true
    const response = await getAccessibleProjectsApi({
      pageNum: 1,
      pageSize: 1000,
      keyword: ""
    })
    if (response.data) {
      projects.value = response.data.records.map((p) => ({
        ...p,
        canShare: true // 在实际应用中应该从后端返回
      }))
    }
  } catch (error) {
    console.error("获取项目列表失败:", error)
    ElMessage.error("获取项目列表失败")
  } finally {
    loading.value = false
  }
}

const handleCreateProject = async () => {
  if (!formData.value.projectName.trim()) {
    ElMessage.warning("请输入项目名称")
    return
  }

  if (!formData.value.simulationType) {
    ElMessage.warning("请选择仿真类型")
    return
  }

  try {
    creating.value = true
    if (formData.value.projectType === "private") {
      await createPrivateProjectApi(formData.value.projectName, formData.value.simulationType)
    } else {
      await createSharedProjectApi(formData.value.projectName, formData.value.simulationType)
    }
    ElMessage.success("项目创建成功")
    showCreateDialog.value = false
    formData.value = { projectName: "", simulationType: SIMULATION_TYPE_OPTIONS[0], projectType: "private" }
    await fetchProjects()
  } catch (error: any) {
    console.error("创建项目失败:", error)
    ElMessage.error(error?.response?.data?.message || "创建项目失败")
  } finally {
    creating.value = false
  }
}

const handleEncrypt = async (project: Project) => {
  try {
    await ElMessageBox.confirm(
      `将项目"${project.project_name}"设为私有？`,
      "确认操作",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    )
    await encryptProjectApi(project.projectId)
    ElMessage.success("项目已设为私有")
    await fetchProjects()
  } catch (error: any) {
    if (error.message !== "cancel") {
      ElMessage.error(error?.response?.data?.message || "操作失败")
    }
  }
}

const handleDecrypt = async (project: Project) => {
  try {
    await ElMessageBox.confirm(
      `将项目"${project.project_name}"设为共享？`,
      "确认操作",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    )
    await decryptProjectApi(project.projectId)
    ElMessage.success("项目已设为共享")
    await fetchProjects()
  } catch (error: any) {
    if (error.message !== "cancel") {
      ElMessage.error(error?.response?.data?.message || "操作失败")
    }
  }
}

const handleDelete = async (project: Project) => {
  try {
    await deleteProjectApi(project.projectId)
    ElMessage.success("项目已删除")
    await fetchProjects()
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || "删除失败（可能项目下有文件）")
  }
}

// 初始化
fetchProjects()
</script>

<style scoped lang="scss">
.project-manager {
  padding: 20px;

  .header {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    align-items: center;
  }
}
</style>
