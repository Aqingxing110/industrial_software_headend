<template>
  <div class="project-selector">
    <el-dialog
      v-model="dialogVisible"
      title="选择或创建项目"
      width="500px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <!-- 现有项目选择 -->
      <div class="existing-projects">
        <h4>选择现有项目</h4>
        <el-empty v-if="filteredProjects.length === 0" description="暂无项目" />
        <div v-else class="project-list">
          <div
            v-for="proj in filteredProjects"
            :key="proj.projectId"
            class="project-item"
            :class="{ selected: selectedProject?.projectId === proj.projectId }"
            @click="selectProject(proj)"
          >
            <div class="project-header">
              <span class="project-name">{{ proj.project_name }}</span>
              <el-tag :type="getProjectType(proj).type" size="small">
                {{ getProjectType(proj).label }}
              </el-tag>
            </div>
            <div class="project-info">
              <span class="text-gray">创建人：{{ proj.creator }}</span>
              <span v-if="proj.organization" class="text-gray">组织：{{ proj.organization }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 创建新项目 -->
      <div class="divider">
        <el-divider>或创建新项目</el-divider>
      </div>

      <div class="create-project">
        <el-input
          v-model="newProjectName"
          placeholder="输入新项目名称"
          clearable
          @keyup.enter="handleCreateProject"
        />

        <div class="project-type-select">
          <el-radio v-model="newProjectType" label="private">私有项目</el-radio>
          <el-radio v-model="newProjectType" label="shared">
            共享项目
            <el-tooltip content="共享项目需要在组织内创建" placement="top">
              <el-icon style="margin-left: 4px">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </el-radio>
        </div>

        <el-button
          type="primary"
          :loading="creating"
          @click="handleCreateProject"
          style="width: 100%; margin-top: 12px"
        >
          创建项目
        </el-button>
      </div>

      <!-- 对话框按钮 -->
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :disabled="!selectedProject" @click="handleConfirm">
          确认选择
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { ElMessage } from "element-plus"
import { QuestionFilled } from "@element-plus/icons-vue"
import {
  getAccessibleProjectsApi,
  createPrivateProjectApi,
  createSharedProjectApi
} from "@/api/projectManagement"
import type { Project } from "@/api/projectManagement/types"

interface Props {
  modelValue: boolean
  selectedProjectId?: number
}

interface Emits {
  (e: "update:modelValue", value: boolean): void
  (e: "select", project: Project): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})
const emit = defineEmits<Emits>()

// 数据
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
})

const projects = ref<Project[]>([])
const selectedProject = ref<Project | null>(null)
const loading = ref(false)
const creating = ref(false)
const newProjectName = ref("")
const newProjectType = ref<"private" | "shared">("private")
const searchKeyword = ref("")

// 计算属性
const filteredProjects = computed(() => {
  return projects.value.filter(
    (p) => p.project_name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
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
      pageSize: 100,
      keyword: ""
    })
    if (response.data) {
      projects.value = response.data.records
      // 如果有selectedProjectId，自动选中
      if (props.selectedProjectId) {
        selectedProject.value =
          projects.value.find((p) => p.projectId === props.selectedProjectId) || null
      }
    }
  } catch (error) {
    console.error("获取项目列表失败:", error)
    ElMessage.error("获取项目列表失败")
  } finally {
    loading.value = false
  }
}

const handleCreateProject = async () => {
  if (!newProjectName.value.trim()) {
    ElMessage.warning("请输入项目名称")
    return
  }

  try {
    creating.value = true
    if (newProjectType.value === "private") {
      await createPrivateProjectApi(newProjectName.value)
    } else {
      await createSharedProjectApi(newProjectName.value)
    }
    ElMessage.success("项目创建成功")
    newProjectName.value = ""
    newProjectType.value = "private"
    // 刷新项目列表
    await fetchProjects()
  } catch (error: any) {
    console.error("创建项目失败:", error)
    ElMessage.error(error?.response?.data?.message || "创建项目失败")
  } finally {
    creating.value = false
  }
}

const selectProject = (project: Project) => {
  selectedProject.value = project
}

const handleConfirm = () => {
  if (selectedProject.value) {
    emit("select", selectedProject.value)
    dialogVisible.value = false
    selectedProject.value = null
  }
}

const handleClose = () => {
  dialogVisible.value = false
  selectedProject.value = null
  newProjectName.value = ""
  newProjectType.value = "private"
}

onMounted(() => {
  if (dialogVisible.value) {
    fetchProjects()
  }
})
</script>

<style scoped lang="scss">
.project-selector {
  .existing-projects {
    margin-bottom: 20px;

    h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
    }

    .project-list {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #dcdfe4;
      border-radius: 4px;
      padding: 8px;
    }

    .project-item {
      padding: 12px;
      margin-bottom: 8px;
      border: 1px solid #e4e7eb;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: #f5f7fa;
        border-color: #409eff;
      }

      &.selected {
        background-color: #ecf5ff;
        border-color: #409eff;
      }

      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .project-name {
          font-weight: 600;
          flex: 1;
        }
      }

      .project-info {
        display: flex;
        gap: 16px;
        font-size: 12px;

        .text-gray {
          color: #909399;
        }
      }
    }
  }

  .divider {
    margin: 16px 0;
  }

  .create-project {
    padding: 12px;
    background-color: #f5f7fa;
    border-radius: 4px;

    .project-type-select {
      margin: 12px 0;
      display: flex;
      gap: 24px;
    }
  }
}
</style>
