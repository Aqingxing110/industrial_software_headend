/**
 * 定义一些数据类型来使用,用来验证格式
 */
export interface LoginRequestData {
  /** admin 或 editor */
  username: string
  /** 密码 */
  password: string
  /** 验证码，修改为verificationCode与后端对应 */
  verificationCode: string
  /**redis验证码key*/
  key: string
}

export type LoginCodeResponseData = ApiResponseData<string>

//export type LoginResponseData = ApiResponseData<{ token: string }>
//export type LoginResponseData = ApiResponseData<string>
export type LoginResponseData = ApiResponseData<{
  token: string
  username: string
  permission: number
  phone: string
  userId: number // 补充userId字段
}>

export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string[] }>
