import { request } from "@/utils/service"
import type { ApiResponse, Server, Task, PageData } from "@/api/monitoring/types/task-server"

// 同步阿里云服务器信息至数据库
function synchronousCloudServer() {
  return request<ApiResponse<PageData<Task>>>({
    url: "/monitoring/servers/synchronize",
    method: "post"
  })
}

// 获取指定服务器可调整规格
function getAdjustableSpecifications(serverId: number) {
  return request<ApiResponse<any>>({
    url: `/monitoring/servers/${serverId}/specifications`,
    method: "get"
  })
}

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
    method: "get",
    params: data
  })
}

// 获取服务器列表
function getServers(data: { pageNum: number; pageSize: number; keyword?: string; status?: string }) {
  return request<ApiResponse<PageData<Server>>>({
    url: "/monitoring/servers",
    method: "get",
    params: data
  })
}

// 调整指定服务器的规格
function changeServerResource(serverId: number, specification: string) {
  return request<ApiResponse<void>>({
    url: `/monitoring/servers/${serverId}/resources`,
    method: "put",
    params: { specification }
  })
}

// 修改任务优先级
function changeTaskPriority(taskId: string, priority: number) {
  return request<ApiResponse<void>>({
    url: `/monitoring/tasks/${taskId}/priority`,
    method: "put",
    params: { priority }
  })
}

function allocateTaskResources(taskIds: number[]) {
  return request<ApiResponse<void>>({
    url: `/monitoring/tasks/allocate`,
    method: "post",
    data: { taskIds }
  })
}

function allocateServerResources(serverIds: number[]) {
  return request<ApiResponse<void>>({
    url: `/monitoring/servers/allocate`,
    method: "post",
    data: { serverIds }
  })
}

export {
  synchronousCloudServer,
  getAdjustableSpecifications,
  getTasksRunning,
  getServers,
  changeServerResource,
  changeTaskPriority,
  allocateTaskResources,
  allocateServerResources
}
