import { request } from "@/utils/service"
import type {
  ApiResponse,
  PageData,
  project,
  OrganizationInfo
} from "@/api/projectManagement/shared/projectManagement/types/projectManagement"

/**
 * 项目管理-->共享项目管理 API
 */

// 获取共享项目分页列表
// 对于keyword如果可以实现的话返回：所有满足 项目名/组织/创建者==keyword 的项目记录信息
export function getProjectsApi(data: { pageNum: number; pageSize: number; keyword?: string }) {
  return request<ApiResponse<PageData<project>>>({
    url: "/modProjects/shared/page",
    method: "post",
    data
  })
}

// 新建共享项目 - 修改路径与后端一致
export function createProjectApi(data: { project_name: string; creator: string; organization: string }) {
  return request<ApiResponse<void>>({
    url: "/modProjects/shared/create",
    method: "post",
    data
  })
}

// 加密项目
export function encryptProjectApi(projectId: number) {
  return request<ApiResponse<void>>({
    url: `/modProjects/shared/${projectId}/encrypt`,
    method: "post"
  })
}

// 删除项目
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
