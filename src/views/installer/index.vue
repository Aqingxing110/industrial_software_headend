<template>
  <div class="component-manager-container">
    <div class="header">
      <h2>组件管理</h2>
    </div>

    <!-- 表格容器 -->
    <div class="tables-container">
      <!-- 未安装组件表格 -->
      <div class="component-table-section">
        <div class="table-header">
          <h3>未安装组件</h3>
          <el-button type="primary" @click="batchInstall" :disabled="selectedUninstalleds.length === 0">
            安装选中组件
          </el-button>
        </div>
        <el-table :data="uninstalledComponents" border @selection-change="handleUninstalledSelect" stripe>
          <el-table-column type="selection" />
          <el-table-column prop="name" label="组件名称" min-width="200">
            <template #default="scope">
              <div class="name-with-tooltip">
                <span>{{ scope.row.name }}</span>
                <el-tooltip
                  class="ml-1"
                  effect="dark"
                  :content="scope.row.description"
                  placement="top"
                  popper-class="component-desc-tooltip"
                >
                  <el-icon size="14" class="question-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="version" label="版本" width="100" />
          <el-table-column prop="size" label="安装包大小" width="120" />
          <el-table-column label="操作" :fixed="'right'">
            <template #default="scope">
              <el-button type="primary" size="small" @click="singleInstall(scope.row)"> 安装 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 已安装组件表格 -->
      <div class="component-table-section">
        <div class="table-header">
          <h3>已安装组件</h3>
          <el-button type="danger" @click="batchUninstall" :disabled="selectedInstalleds.length === 0">
            卸载选中组件
          </el-button>
        </div>
        <el-table :data="installedComponents" border @selection-change="handleInstalledSelect" stripe>
          <el-table-column type="selection" />
          <el-table-column prop="name" label="组件名称" min-width="200">
            <template #default="scope">
              <div class="name-with-tooltip">
                <span>{{ scope.row.name }}</span>
                <el-tooltip
                  class="ml-1"
                  effect="dark"
                  :content="scope.row.description"
                  placement="top"
                  popper-class="component-desc-tooltip"
                >
                  <el-icon size="14" class="question-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="version" label="版本" width="100" />
          <el-table-column prop="size" label="大小" width="100" />
          <el-table-column prop="installTime" label="安装时间" width="200" />
          <el-table-column label="操作" :fixed="'right'">
            <template #default="scope">
              <el-button type="danger" size="small" @click="singleUninstall(scope.row)"> 卸载 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <el-dialog :title="confirmType === 'install' ? '确认安装' : '确认卸载'" v-model="confirmVisible" width="400px">
      <div>
        <p>{{ confirmType === "install" ? "确定安装以下组件？" : "确定卸载以下组件？" }}</p>
        <ul style="max-height: 200px; overflow-y: auto; padding-left: 20px; margin: 10px 0">
          <li v-for="name in confirmComponentNames" :key="name">{{ name }}</li>
        </ul>
        <p v-if="confirmType === 'install'" style="color: #666; font-size: 14px">
          确认后将自动下载安装包，请到浏览器下载列表查看！
        </p>
        <p v-else style="color: #f56c6c">卸载后将无法使用该组件功能！</p>
      </div>
      <template #footer>
        <el-button @click="confirmVisible = false">取消</el-button>
        <el-button :type="confirmType === 'install' ? 'primary' : 'danger'" @click="handleConfirm">
          {{ confirmType === "install" ? "确认安装" : "确认卸载" }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { QuestionFilled } from "@element-plus/icons-vue"
import type { Component, Data } from "@/api/installer/types"
// import {
//   getUninstalledComponents,
//   getInstalledComponents,
//   installComponents,
//   uninstallComponents
// } from "@/api/installer"

// 响应式数据
const installedComponents = ref<Component[]>([])
const uninstalledComponents = ref<Component[]>([])

// ========== 模拟数据 ==========
// 未安装组件模拟数据
let mockUninstalledComponents: Component[] = [
  {
    id: 1,
    name: "冲击前处理程序",
    version: "1.2.0",
    size: "2.5MB",
    description: "提供丰富的数据可视化图表功能，支持折线图、柱状图、饼图等多种图表类型，可自定义样式和交互效果",
    dynamicsDirection: "冲击",
    moduleType: "前处理"
  },
  {
    id: 2,
    name: "结构前处理程序",
    version: "2.0.1",
    size: "4.8MB",
    description: "支持Excel文件的导入和导出操作，兼容.xlsx和.xls格式，可自定义导入校验规则和导出模板",
    dynamicsDirection: "结构",
    moduleType: "前处理"
  },
  {
    id: 3,
    name: "多体前处理程序",
    version: "3.1.5",
    size: "3.2MB",
    description: "提供强大的富文本编辑功能，支持图片上传、格式排版、表格插入、代码块等常用编辑能力",
    dynamicsDirection: "多体",
    moduleType: "前处理"
  },
  {
    id: 4,
    name: "CPU冲击求解器程序",
    version: "1.8.3",
    size: "1.9MB",
    description: "实现用户权限和角色管理功能，支持基于RBAC模型的权限控制，可配置菜单权限、按钮权限等",
    dynamicsDirection: "冲击",
    moduleType: "求解器",
    resourceType: "CPU"
  },
  {
    id: 5,
    name: "GPU冲击求解器程序",
    version: "1.8.3",
    size: "1.9MB",
    description: "实现用户权限和角色管理功能，支持基于RBAC模型的权限控制，可配置菜单权限、按钮权限等",
    dynamicsDirection: "冲击",
    moduleType: "求解器",
    resourceType: "GPU"
  }
]

// 已安装组件模拟数据
let mockInstalledComponents: Component[] = [
  {
    id: 6,
    name: "结构求解器程序",
    version: "4.0.0",
    size: "1.1MB",
    installTime: "2024-05-10 14:23:56",
    description: "提供基础的表格展示和操作功能，支持排序、筛选、分页、单元格编辑等基础能力",
    dynamicsDirection: "结构",
    moduleType: "求解器"
  },
  {
    id: 7,
    name: "多体求解器程序",
    version: "2.7.8",
    size: "0.8MB",
    installTime: "2024-04-28 09:15:32",
    description: "支持多种样式和功能的弹窗展示，包括普通提示、确认弹窗、自定义内容弹窗等，可配置动画效果",
    dynamicsDirection: "多体",
    moduleType: "求解器"
  },
  {
    id: 8,
    name: "后处理程序",
    version: "3.3.2",
    size: "1.5MB",
    installTime: "2024-05-05 16:40:18",
    description: "提供灵活的表单校验规则和提示功能，支持同步/异步校验，可自定义校验提示样式和位置"
  }
]

// 选中状态
const selectedUninstalleds = ref<Data[]>([])
const selectedInstalleds = ref<Data[]>([])

// 弹窗相关
const confirmVisible = ref(false)
const confirmType = ref<"install" | "uninstall">("install")
const confirmComponentNames = ref<string[]>([])

// 接口请求
const getUninstalledComponentList = async () => {
  try {
    // const res = await getUninstalledComponents()
    // uninstalledComponents.value = res.data || []
    uninstalledComponents.value = [...mockUninstalledComponents]
  } catch (err) {
    ElMessage.error("获取组件列表失败，请刷新重试")
    console.error("获取组件列表失败：", err)
  }
}

const getInstalledComponentList = async () => {
  try {
    // const res = await getInstalledComponents()
    // installedComponents.value = res.data || []
    installedComponents.value = [...mockInstalledComponents]
  } catch (err) {
    ElMessage.error("获取已安装组件列表失败，请刷新重试")
    console.error("获取已安装组件列表失败：", err)
  }
}

// 安装组件
const handleInstallComponents = async (data: Data[]) => {
  try {
    // const res = await installComponents(data)
    // if (res.code === 200) {
    //   await getUninstalledComponentList()
    //   await getInstalledComponentList()
    //   return { success: true, msg: `已触发${data.length}个组件安装包下载` }
    // } else {
    //   return { success: false, msg: res.message || "安装包下载失败" }
    // }
    const ids = data.map((item) => item.id)
    const installedItems = mockUninstalledComponents.filter((item) => ids.includes(item.id))
    mockUninstalledComponents = mockUninstalledComponents.filter((item) => !ids.includes(item.id))
    mockInstalledComponents.push(...installedItems)

    // 刷新列表
    await getInstalledComponentList()
    await getUninstalledComponentList()
    // 模拟安装成功
    return { success: true, msg: `已触发${ids.length}个组件安装包下载` }
  } catch (err) {
    return { success: false, msg: "调用安装接口失败" }
  }
}

// 卸载组件
const handleUninstallComponents = async (data: Data[]) => {
  try {
    // const res = await uninstallComponents(data)
    // if (res.code === 200) {
    //   await getUninstalledComponentList()
    //   await getInstalledComponentList()
    //   return { success: true, msg: `成功卸载${data.length}个组件` }
    // } else {
    //   return { success: false, msg: res.message || "卸载失败" }
    // }
    const ids = data.map((item) => item.id)
    const uninstalledItems = mockInstalledComponents.filter((item) => ids.includes(item.id))
    mockInstalledComponents = mockInstalledComponents.filter((item) => !ids.includes(item.id))
    mockUninstalledComponents.push(...uninstalledItems)

    // 刷新列表
    await getUninstalledComponentList()
    await getInstalledComponentList()

    return { success: true, msg: `成功卸载${ids.length}个组件` }
  } catch (err) {
    return { success: false, msg: "调用卸载接口失败" }
  }
}

// 事件处理
const handleUninstalledSelect = (val: Component[]) => {
  selectedUninstalleds.value = val.map((item) => ({
    id: item.id,
    dynamicsDirection: item.dynamicsDirection,
    moduleType: item.moduleType,
    resourceType: item.resourceType
  }))
}
const handleInstalledSelect = (val: Component[]) => {
  selectedInstalleds.value = val.map((item) => ({
    id: item.id,
    dynamicsDirection: item.dynamicsDirection,
    moduleType: item.moduleType,
    resourceType: item.resourceType
  }))
}

const singleInstall = (row: Component) => {
  selectedUninstalleds.value = [
    { id: row.id, dynamicsDirection: row.dynamicsDirection, moduleType: row.moduleType, resourceType: row.resourceType }
  ]
  openConfirmModal("install")
}
const singleUninstall = (row: Component) => {
  selectedInstalleds.value = [
    { id: row.id, dynamicsDirection: row.dynamicsDirection, moduleType: row.moduleType, resourceType: row.resourceType }
  ]
  openConfirmModal("uninstall")
}

const batchInstall = () => openConfirmModal("install")
const batchUninstall = () => openConfirmModal("uninstall")

const openConfirmModal = (type: "install" | "uninstall") => {
  confirmType.value = type
  if (type === "install") {
    confirmComponentNames.value = selectedUninstalleds.value.map(
      (Data) => uninstalledComponents.value.find((item) => item.id === Data.id)?.name || "组件" + Data.id
    )
  } else {
    confirmComponentNames.value = selectedInstalleds.value.map(
      (Data) => installedComponents.value.find((item) => item.id === Data.id)?.name || "组件" + Data.id
    )
  }
  confirmVisible.value = true
}

const handleConfirm = async () => {
  confirmVisible.value = false
  let result: { success: boolean; msg: string }

  if (confirmType.value === "install") {
    result = await handleInstallComponents(
      selectedUninstalleds.value.map((item) => ({
        id: item.id,
        dynamicsDirection: item.dynamicsDirection,
        moduleType: item.moduleType,
        resourceType: item.resourceType
      }))
    )
    selectedUninstalleds.value = []
  } else {
    result = await handleUninstallComponents(
      selectedInstalleds.value.map((item) => ({
        id: item.id,
        dynamicsDirection: item.dynamicsDirection,
        moduleType: item.moduleType,
        resourceType: item.resourceType
      }))
    )
    selectedInstalleds.value = []
  }

  ElMessageBox.alert(result.msg, result.success ? "操作成功" : "操作失败", {
    type: result.success ? "success" : "error",
    confirmButtonText: "确定"
  })
}

// 页面加载时获取组件列表
onMounted(() => {
  getUninstalledComponentList()
  getInstalledComponentList()
})
</script>

<style scoped lang="scss">
.component-manager-container {
  width: 100%;
  margin: 20px auto;
  padding: 0 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .tables-container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .component-table-section {
    flex: 1;
    min-width: 500px;
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }
    }

    :deep(.el-table) {
      --el-table-header-text-color: #666;
      --el-table-row-hover-bg-color: #f8f9fa;
    }

    // 名称+问号图标样式
    .name-with-tooltip {
      display: flex;
      align-items: center;

      .question-icon {
        color: #909399;
        cursor: help;
        transition: color 0.2s;

        &:hover {
          color: #409eff;
        }
      }
    }

    // 自定义tooltip样式
    :deep(.component-desc-tooltip) {
      max-width: 400px;
      white-space: pre-wrap;
      line-height: 1.4;
    }
  }
}
</style>
