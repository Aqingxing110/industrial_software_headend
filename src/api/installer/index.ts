import { request } from "@/utils/service"
import type { ApiResponse, Component } from "@/api/installer/types"

// 获取组件列表
const getComponents = () => {
  return request<ApiResponse<Component[]>>({
    url: "/components",
    method: "get"
  })
}

const installComponent = (componentId: number) => {
  return request<Blob>({
    url: "/components/install",
    method: "get",
    params: { componentId },
    responseType: "blob"
  })
}

export { getComponents, installComponent }
