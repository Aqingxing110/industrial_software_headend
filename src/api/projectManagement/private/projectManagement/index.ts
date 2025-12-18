import { request } from "@/utils/service"
import type {
  ApiResponse,
  PageData,
  project
} from "@/api/projectManagement/private/projectManagement/types/projectManagement"

/**
 * 项目管理-->私有项目管理 API
 */

// 获取私有项目分页列表
// 对于keyword如果可以实现的话返回：所有满足 项目名/组织/创建者==keyword 的项目记录信息
export function getProjectsApi(data: { pageNum: number; pageSize: number; keyword?: string }) {
  return request<ApiResponse<PageData<project>>>({
    url: "/modProjects/private/page",
    method: "post",
    data
  })
}

// 新建项目
export function createProjectApi(data: { project_name: string; creator: string; organization: string }) {
  return request<ApiResponse<void>>({
    url: "/modProjects/private/create",
    method: "post",
    data
  })
}

// 取消加密项目   将该项目lock设为0
export function unencryptProjectApi(projectId: number) {
  return request<ApiResponse<void>>({
    url: `/modProjects/private/${projectId}/decrypt`,
    method: "post"
  })
}

// 删除项目（并删除该项目下的所有任务）
export function deleteProjectApi(projectId: number) {
  return request<ApiResponse<void>>({
    url: `/modProjects/delete/${projectId}`,
    method: "delete"
  })
}

// 获取用户组织信息
export function getUserOrganizationApi() {
  return request<ApiResponse<OrganizationInfo>>({
    url: "/user/organization", // 根据实际后端路径调整
    method: "get"
  })
}