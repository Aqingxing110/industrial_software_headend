<template>
  <div class="task-page">
    <!-- 导航 -->
    <div class="breadcrumb">
      <router-link to="/task-management/shared">/共享项目</router-link>
    </div>

    <!-- 组织信息提示 -->
    <div class="organization-info">
      <el-alert
        v-if="organizationInfo.organizationId === -1"
        title="当前用户还没有加入组织"
        type="warning"
        :closable="false"
        show-icon
      />
      <div v-else class="organization-name">当前用户的组织为：{{ organizationInfo.organizationName }}</div>
    </div>

    <!-- 搜索框、搜索按钮和新建项目按钮 -->
    <div class="header">
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="请输入项目名称/创建者名称"
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" @click="handleSearch" class="search-btn" :loading="isLoading">搜索</el-button>
      </div>
      <el-tooltip
        :content="organizationInfo.organizationId === -1 ? '请先加入组织后再创建共享项目' : ''"
        :disabled="organizationInfo.organizationId !== -1"
        placement="top"
      >
        <div>
          <el-button
            type="primary"
            @click="createProjectDialogVisible = true"
            class="add-task-btn"
            :disabled="organizationInfo.organizationId === -1"
          >
            新建项目
          </el-button>
        </div>
      </el-tooltip>
    </div>

    <!-- 项目列表表格 -->
    <el-table :data="projectData" style="width: 100%" v-loading="isLoading">
      <el-table-column prop="project_name" label="项目名称">
        <template #default="{ row }">
          <router-link :to="`/task-management/shared/${row.projectId}`">{{ row.project_name }}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="创建者" />
      <el-table-column prop="creation_time" label="创建时间" />
      <el-table-column label="操作" width="280">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="viewProject(row)">查看</el-button>
          <el-button v-if="row.creator === currentUser" size="small" @click="encryptProject(row)">加密</el-button>
          <el-button size="small" type="danger" @click="deleteProject(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :key="paginationKey"
      background
      layout="total, prev, pager, next, jumper"
      :total="totalProjects"
      :current-page="currentPage"
      :page-size="pageSize"
      @current-change="handlePageChange"
      class="pagination"
      :disabled="isLoading"
    />

    <!-- 新建项目对话框 -->
    <el-dialog title="新建共享项目" v-model="createProjectDialogVisible" width="500px">
      <el-form
        ref="projectFormRef"
        :model="projectForm"
        status-icon
        :rules="projectRules"
        label-width="auto"
        class="demo-ruleForm"
      >
        <el-form-item label="项目名称" prop="project_name">
          <el-input v-model="projectForm.project_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="projectForm.creator" disabled />
        </el-form-item>
        <el-form-item label="所属组织">
          <el-input v-model="projectForm.organization" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createProjectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateProject">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElInput,
  ElPagination,
  ElDialog,
  ElForm,
  ElFormItem,
  ElMessage,
  ElMessageBox,
  ElTooltip
} from "element-plus"
import { getUserInfoApi } from "@/api/userInfo"
import {
  getProjectsApi,
  createProjectApi,
  encryptProjectApi,
  deleteProjectApi,
  getUserOrganizationApi
} from "@/api/projectManagement/shared/projectManagement"

const router = useRouter()

import type { project } from "@/api/projectManagement/shared/projectManagement/types/projectManagement"

// 添加组织信息响应式变量
const organizationInfo = ref({
  organizationId: 0,
  organizationName: ""
})

// 项目数据
const projectData = ref<project[]>([])
const currentUser = ref("")
const isLoading = ref(false)
const paginationKey = ref(0)

// 分页配置
const totalProjects = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 搜索框的绑定值
const searchQuery = ref("")

// 新建项目对话框
const createProjectDialogVisible = ref(false)
const projectFormRef = ref()
const projectForm = ref({
  project_name: "",
  creator: "",
  organization: ""
})
const projectRules = ref({
  project_name: [{ required: true, message: "项目名称不能为空", trigger: "blur" }]
})

// 获取分页项目数据
const fetchProject = async (forceUpdate = false) => {
  if (isLoading.value && !forceUpdate) return

  console.log("当前搜索关键词:", searchQuery.value)

  isLoading.value = true
  try {
    const response = await getProjectsApi({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchQuery.value
    })
    projectData.value = response.data.records
    totalProjects.value = response.data.total
    paginationKey.value++
  } catch (error) {
    console.error("获取项目列表失败:", error)
    ElMessage.error("获取项目列表失败")
  } finally {
    isLoading.value = false
  }
}

// 查看项目详情
const viewProject = (row: project) => {
  router.push(`/task-management/shared/${row.projectId}`)
}

// 搜索功能
const handleSearch = () => {
  if (currentPage.value === 1) {
    fetchProject(true)
  } else {
    currentPage.value = 1
  }
}

// 新建项目
const handleCreateProject = async () => {
  if (!projectFormRef.value) return
  projectFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await createProjectApi(projectForm.value)
        ElMessage.success("项目创建成功")
        await fetchProject(true)
        createProjectDialogVisible.value = false
      } catch (error) {
        console.error("新建项目失败:", error)
        ElMessage.error("新建项目失败")
      }
    }
  })
}

//加密项目
const encryptProject = async (row: project) => {
  try {
    // 添加确认对话框
    await ElMessageBox.confirm("确定要加密该项目吗？加密后将变为私有项目", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })

    isLoading.value = true
    const response = await encryptProjectApi(row.projectId)

    if (response.code === 200) {
      ElMessage.success("项目加密成功")
      await fetchProject(true) // 强制刷新数据
    } else {
      ElMessage.error(response.message || "项目加密失败")
    }
  } catch (error) {
    if ((error as Error).message !== "cancel") {
      console.error("项目加密失败:", error)
      ElMessage.error("项目加密失败")
    }
  } finally {
    isLoading.value = false
  }
}

// 删除项目
const deleteProject = async (row: project) => {
  try {
    await ElMessageBox.confirm("确定要删除该项目吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })

    await deleteProjectApi(row.projectId)
    ElMessage.success("项目删除成功")
    await fetchProject(true)
  } catch (error) {
    if ((error as Error).message !== "cancel") {
      console.error("项目删除失败:", error)
      ElMessage.error("项目删除失败")
    }
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  if (currentPage.value === page) return

  currentPage.value = page
  fetchProject()
}

// 在组件挂载时获取当前用户信息和所有共享任务信息
onMounted(async () => {
  try {
    // 获取用户信息
    const userResponse = await getUserInfoApi()
    currentUser.value = userResponse.data.username
    projectForm.value.creator = currentUser.value
    projectForm.value.organization = userResponse.data.organization

    // 获取用户组织信息
    const orgResponse = await getUserOrganizationApi()
    organizationInfo.value = {
      organizationId: orgResponse.data.orgId,
      organizationName: orgResponse.data.orgName
    }

    // 获取所有共享项目数据
    await fetchProject()
  } catch (error) {
    console.error("初始化失败:", error)
    ElMessage.error("初始化失败")
  }
})
</script>

<style scoped lang="scss">
.task-page {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}
.organization-info {
  margin: 15px 0;
  padding: 10px 0;

  .organization-name {
    font-size: 16px;
    font-weight: 500;
    color: #606266;
    padding: 8px 0;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  width: 300px;
}

.el-table {
  margin: 20px 0;
  flex-grow: 1;
}

.pagination {
  margin-top: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 为操作按钮添加间距 */
.el-table-column--op .el-button {
  margin-right: 8px;
  margin-bottom: 4px;
}
</style>
