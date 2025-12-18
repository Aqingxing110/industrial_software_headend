import { request } from "@/utils/service"
import type { ApiResponse, PageData, task } from "@/api/projectManagement/shared/taskManagement/types/taskManagement"

/**
 * 项目管理-->私有项目管理-->任务管理 API
 */

// 获取私有任务分页列表
export function getTasksByProjectIdApi(
  projectId: number,
  data: { pageNum: number; pageSize: number; keyword?: string }
) {
  return request<ApiResponse<PageData<task>>>({
    url: `/modTasks/private/${projectId}/page`,
    method: "post",
    data
  })
}

// 新建任务
export function createTaskApi(
  projectId: number,
  data: { taskName: string; simulationStage: string; type: string; creator: string; computeResource?: string } // 新增可选的计算资源参数
) {
  return request<ApiResponse<void>>({
    url: `/modTasks/private/${projectId}/create`,
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

// 开始任务
export function startTaskApi(taskId: number) {
  return request<ApiResponse<void>>({
    url: `/modTasks/start/${taskId}`,
    method: "put"
  })
}

// 结束任务
export function stopTaskApi(taskId: number) {
  return request<ApiResponse<void>>({
    url: `/modTasks/stop/${taskId}`,
    method: "put"
  })
}
