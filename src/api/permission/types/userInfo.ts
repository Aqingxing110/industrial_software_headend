// types/userInfo.ts
//
// export interface UserInfoVO {
//   userId: number
//   username: string
//   permission: number // 1: 管理员权限, 0: 普通用户权限
//   phone: string
// }
//
// export interface PageVO<T> {
//   pageNum: number // 当前页码
//   pageSize: number // 每页大小
//   total: number // 总记录数
//   pages: number // 总页数
//   records: T[] // 用户信息列表
// }
//
// export interface UserPageResponseData {
//   success: boolean // 请求是否成功
//   pageResult: PageVO<UserInfoVO> // 分页查询结果
// }
//
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PageData<T> {
  records: T[]
  total: number
  size: number
  current: number
}
export interface PermissionUser {
  userId: number
  username: string
  phone: string
  permission: number
  taskPermission: number
  organization: string
  orgId: string
}
