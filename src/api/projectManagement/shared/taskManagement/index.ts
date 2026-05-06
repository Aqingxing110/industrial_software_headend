import { request } from "@/utils/service"
import type { ApiResponse, PageData, task } from "@/api/projectManagement/shared/taskManagement/types/taskManagement"

/**
 * 项目管理-->共享项目管理-->任务管理 API
 */

// 获取共享任务分页列表
export function getTasksByProjectIdApi(
  projectId: number,
  data: { pageNum: number; pageSize: number; keyword?: string }
) {
  return request<ApiResponse<PageData<task>>>({
    url: `/modTasks/shared/${projectId}/page`,
    method: "post",
    data
  })
}

// 新建任务
export function createTaskApi(
  projectId: number,
  data: {
    taskName: string
    simulationStage: string
    type: string
    creator: string
    priority?: number
    computeResource?: string
  }
) {
  return request<ApiResponse<void>>({
    url: `/modTasks/shared/${projectId}/create`,
    method: "post",
    data
  })
}

// 删除任务
export function deleteTaskApi(taskId: number) {
  return request<ApiResponse<void>>({
    url: `/modTasks/delete/${taskId}`,
    method: "delete"
  })
}

// 远程开始任务
export function remoteStartTaskApi(taskId: number, priority: number) {
  return request<ApiResponse<void>>({
    url: `/modTasks/start/remote/${taskId}`,
    method: "put",
    data: { priority }
  })
}

// 客户端本地任务状态上报
export function changeTaskStatusApi(taskId: number, status: string, progress?: number, errorMsg?: string) {
  return request<ApiResponse<void>>({
    url: `/modTasks/client/status/${taskId}`,
    method: "put",
    data: { status, progress, errorMsg }
  })
}
