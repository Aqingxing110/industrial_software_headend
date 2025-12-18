import { request } from "@/utils/service"
import type * as Reg from "./types/register"
//import * as Qs from "qs"
/** 注册 */
export function registerApi(data: Reg.RegisterRequestData) {
  return request<Reg.RegisterResponseData>({
    url: "/modUsers/register", // 使用代理路径
    method: "post",
    data
  })
}
