export type UserInfoResponseData = ApiResponseData<{
  /** 用户名 */
  username: string
  /** 用户电话号码 */
  phone: string
  /** 用户权限等级，0表示普通用户，1表示管理员 */
  permission: number
  /** 用户所属组织 */
  organization: string
}>
