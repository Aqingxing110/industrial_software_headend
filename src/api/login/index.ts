/**
 * 编写一些数据接口以供调用，在login的index.vue调用
 */

import { request } from "@/utils/service"
import type * as Login from "./types/login"
//import * as Qs from "qs"

/** 获取登录验证码 */
/* export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: "auth/verifyCode",
    method: "get"
  })
} */
/** 获取登录验证码 */
export function getLoginCodeApi(params: { key: string }) {
  return request<Login.LoginCodeResponseData>({
    url: "/auth/verifyCode", // 添加前缀斜杠
    method: "get",
    params // 传递key作为查询参数
  })
}

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "auth/jsonLogin",
    method: "post",
    //data: Qs.stringify(data)
    data
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "auth/userDetail",
    method: "get"
  })
}
