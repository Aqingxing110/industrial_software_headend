import { request } from "@/utils/service"
import type * as UserInfo from "./types/userInfo"
import type { ApiResponse, PageData } from "@/api/permission/types/userInfo"

// /**
//  * 获取用户分页数据
//  * @param queryDTO 分页查询条件，包含页码、每页记录数和搜索关键词
//  * @returns 返回分页查询结果
//  */
// export function getUserPageApi(queryDTO: { pageNum: number; pageSize: number; keyword: string }) {
//   return request<UserInfo.UserPageResponseData>({
//     url: "/modUsers/page", // 假设这是分页查询用户信息的接口路径
//     method: "POST",
//     data: queryDTO // 传递查询参数，包含分页信息和搜索关键词
//   })
// }
//
// /**
//  * 修改用户权限
//  * @param userId 用户ID
//  * @param permission 权限值 (0: 普通用户, 1: 管理员)
//  */
// export function changeUserPermissionApi(userId: number, permission: number) {
//   return request<ApiResponse>({
//     url: `/admin/users/${userId}/changePermission`,
//     method: "POST",
//     params: { permission }
//   })
// }
interface PermissionUser {
  userId: number
  username: string
  phone: string
  permission: number
  taskPermission: number
  organization: string
  orgId: string
}

export function getUserPageApi(params: { pageNum: number; pageSize: number; keyword?: string }) {
  return request<ApiResponse<PageData<PermissionUser>>>({
    url: "/admin/users/page",
    method: "post",
    data: params
  })
}

export function changePermissionApi(userId: number, permission: number) {
  return request<ApiResponse<void>>({
    url: `/admin/users/${userId}/changePermission`,
    method: "post",
    params: { permission }
  })
}

/**
 * 更新用户任务权限
 * @param userId 用户ID
 * @param taskPermission 任务权限值 (0: 个人权限, 1: 组织权限)
 */
export function updateUserTaskPermissionApi(userId: number, permission: number) {
  return request<ApiResponse<void>>({
    url: "/user/permission",
    method: "POST",
    data: {
      userId,
      permission
    }
  })
}

/**
 * 更新用户所属组织
 * @param userId 用户ID
 * @param orgId 组织ID (传空字符串表示移出组织)
 */
export function updateUserOrganizationApi(userId: number, orgId: string) {
  return request<ApiResponse<{ newOrganization: string }>>({
    url: "/user/organization",
    method: "POST",
    data: {
      userId,
      orgId
    }
  })
}
