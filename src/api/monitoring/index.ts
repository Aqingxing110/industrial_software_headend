import { request } from "@/utils/service"
import type { ApiResponse, Server, Task, PageData } from "@/api/monitoring/types/task-server"

// 获取任务列表
function getTasksRunning(data: {
  pageNum: number
  pageSize: number
  keyword?: string
  status?: string
  serverId?: number
}) {
  return request<ApiResponse<PageData<Task>>>({
    url: "/monitoring/tasks",
    method: "post",
    data
  })
}

// 获取服务器列表
function getServers(data: { pageNum: number; pageSize: number; keyword?: string; status?: string; type?: string }) {
  return request<ApiResponse<PageData<Server>>>({
    url: "/monitoring/servers",
    method: "post",
    data
  })
}

// 修改服务器资源配置
function changeServerResource(serverId: number, data: { cpuCores: number; memory: number }) {
  return request<ApiResponse<void>>({
    url: `/monitoring/servers/${serverId}/resources`,
    method: "put",
    data
  })
}

// 修改任务优先级
function changeTaskPriority(taskId: number, priority: number) {
  return request<ApiResponse<void>>({
    url: `/monitoring/tasks/${taskId}/priority`,
    method: "put",
    data: priority
  })
}

function allocateTaskResources(taskIds: number[]) {
  return request<ApiResponse<void>>({
    url: `/monitoring/tasks/allocate`,
    method: "post",
    data: taskIds
  })
}

function allocateServerResources(serverIds: number[]) {
  return request<ApiResponse<void>>({
    url: `/monitoring/servers/allocate`,
    method: "post",
    data: serverIds
  })
}

export {
  getTasksRunning,
  getServers,
  changeServerResource,
  changeTaskPriority,
  allocateTaskResources,
  allocateServerResources
}
