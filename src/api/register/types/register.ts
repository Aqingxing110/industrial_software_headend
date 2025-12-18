export interface RegisterRequestData {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 电话号码 */
  phone: string
  /**权限 */
  permission: number
}

export type RegisterResponseData = ApiResponseData<string>
