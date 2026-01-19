/**
 * 编写一些数据接口以供调用，在个人中心的组件中调用
 */

import { request } from "@/utils/service"
import type * as UserInfo from "./types/userInfo"
//import * as Qs from "qs"

/** 获取用户信息 */
export function getUserInfoApi() {
  return request<UserInfo.UserInfoResponseData>({
    url: "/modUsers/info", // 假设这是获取当前用户信息的接口路径
    method: "get"
  })
}

export function changePasswordApi(oldPassword: string, newPassword: string) {
  return request({
    url: "/modUsers/changePassword",
    method: "POST",
    data: {
      oldPassword,
      newPassword
    }
  })
}
