// src/api/userManagement/index.ts
import { request } from "@/utils/service"
import type { ApiResponse, PageData, User } from "@/api/userManagement/types/userManagement"
/**
 * 管理员用户管理API
 */

// 管理员获取用户分页列表
export function getPageUsersApi(data: { pageNum: number; pageSize: number; keyword?: string }) {
  return request<ApiResponse<PageData<User>>>({
    url: "/admin/users/page",
    method: "post",
    data
  })
}

//获取所有用户信息
export function getAllUsersApi() {
  return request({
    url: "/modUsers",
    method: "get"
  })
}

// 管理员修改用户信息
export function updateUserInfoApi(userId: number, data: { username: string; phone: string }) {
  return request<ApiResponse<void>>({
    url: `/admin/users/${userId}/info`,
    method: "post",
    data
  })
}

// 管理员重置用户密码
export function resetPasswordApi(userId: number) {
  return request<ApiResponse<void>>({
    url: `/admin/users/${userId}/resetPassword`,
    method: "post"
  })
}

// 管理员删除用户 - 使用DELETE方法
export function deleteUserApi(userId: number) {
  return request<ApiResponse<void>>({
    url: `/admin/users/${userId}`,
    method: "delete"
  })
}
