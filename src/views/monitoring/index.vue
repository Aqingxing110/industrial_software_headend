<script setup lang="ts">
import { ref, onMounted } from "vue"
import { ElTable, ElTableColumn, ElButton, ElInput, ElPagination, ElTag, ElMessage } from "element-plus"

// ---------- 类型定义 ----------
interface Server {
  id: string
  name: string
  ip: string
  type: string
  status: "running" | "idle" | "offline" | "maintenance"
  cpuCores: number
  memory: number
  cpuUsage: number
  memoryUsage: number
  currentTask: string | null
  lastOnline: string
}

// interface ServerListParams {
//   page: number
//   pageSize: number
//   search?: string
//   status?: string
//   type?: string
// }

// interface ServerListResp {
//   total: number
//   list: Server[]
// }

// ---------- 响应式数据 ----------
const servers = ref<Server[]>([])
const totalServers = ref(0)
const isLoading = ref(false)

// 搜索 / 筛选
const searchQuery = ref("")
const statusFilter = ref("all")
const typeFilter = ref("all")

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// ---------- 工具函数 ----------
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    running: "运行中",
    idle: "空闲",
    offline: "离线",
    maintenance: "维护中"
  }
  return map[status] || "未知"
}
const getStatusTagType = (status: string) => {
  if (status === "running") return "success"
  if (status === "idle") return ""
  if (status === "offline") return "danger"
  if (status === "maintenance") return "info"
  return ""
}

// ---------- API 调用封装 ----------
const fetchServers = async () => {
  isLoading.value = true
  try {
    // TODO: 调用后端接口 GET /api/servers
    // const params: ServerListParams = {
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   search: searchQuery.value || undefined,
    //   status: statusFilter.value === 'all' ? undefined : statusFilter.value,
    //   type: typeFilter.value === 'all' ? undefined : typeFilter.value
    // }
    // const resp: ServerListResp = await $http.get('/api/servers', { params })
    // servers.value = resp.list
    // totalServers.value = resp.total
  } catch (e) {
    ElMessage.error("获取服务器列表失败")
  } finally {
    isLoading.value = false
  }
}

// ---------- 事件处理 ----------
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchServers()
}
const resetFilters = () => {
  searchQuery.value = ""
  statusFilter.value = "all"
  typeFilter.value = "all"
  currentPage.value = 1
  fetchServers()
}

// ---------- 初始化 ----------
onMounted(() => {
  fetchServers()
})
</script>

<template>
  <div class="resource-page">
    <!-- 搜索 / 筛选 -->
    <div class="header">
      <div class="search-container">
        <el-input v-model="searchQuery" placeholder="搜索服务器名称或IP" clearable @keyup.enter="fetchServers" />
        <el-button type="primary" @click="fetchServers" :loading="isLoading">搜索</el-button>
      </div>
      <div class="button-group">
        <el-button @click="fetchServers" :loading="isLoading"> <i class="el-icon-refresh" /> 刷新 </el-button>
      </div>
    </div>

    <div class="filter-container">
      <el-select v-model="statusFilter" placeholder="状态筛选" clearable>
        <el-option label="全部状态" value="all" />
        <el-option label="运行中" value="running" />
        <el-option label="空闲" value="idle" />
        <el-option label="离线" value="offline" />
        <el-option label="维护中" value="maintenance" />
      </el-select>

      <el-select v-model="typeFilter" placeholder="类型筛选" clearable>
        <el-option label="全部类型" value="all" />
        <el-option label="GPU服务器" value="GPU服务器" />
        <el-option label="CPU服务器" value="CPU服务器" />
        <el-option label="存储服务器" value="存储服务器" />
      </el-select>

      <el-button @click="resetFilters">重置筛选</el-button>
    </div>

    <!-- 服务器列表 -->
    <el-table :data="servers" :style="{ width: '100%' }" v-loading="isLoading">
      <el-table-column prop="name" label="服务器名称" min-width="150" />
      <el-table-column prop="ip" label="IP地址" width="130" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="CPU使用率" width="150">
        <template #default="{ row }">
          <div class="progress-cell">
            <span>{{ row.cpuUsage }}%</span>
            <el-progress
              :percentage="row.cpuUsage"
              :color="row.cpuUsage > 80 ? '#f56c6c' : '#67c23a'"
              :stroke-width="8"
              :show-text="false"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="内存使用率" width="150">
        <template #default="{ row }">
          <div class="progress-cell">
            <span>{{ row.memoryUsage }}%</span>
            <el-progress
              :percentage="row.memoryUsage"
              :color="row.memoryUsage > 80 ? '#f56c6c' : '#409eff'"
              :stroke-width="8"
              :show-text="false"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="currentTask" label="当前任务" min-width="150">
        <template #default="{ row }">{{ row.currentTask || "空闲" }}</template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      :total="totalServers"
      :current-page="currentPage"
      :page-size="pageSize"
      @current-change="handlePageChange"
      class="pagination"
      :disabled="isLoading"
    />
  </div>
</template>

<style scoped lang="scss">
.resource-page {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;

    .search-container {
      display: flex;
      gap: 10px;
      flex-grow: 1;
      max-width: 500px;
    }

    .button-group {
      display: flex;
      gap: 10px;
    }
  }

  .filter-container {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .el-table {
    margin: 20px 0;
    flex-grow: 1;

    .progress-cell {
      display: flex;
      flex-direction: column;
      gap: 5px;

      span {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }

  .pagination {
    margin-top: 20px;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
