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
  return request<ApiResponse<{ downloadUrl: string }>>({
    url: `/components/install/${componentId}/download-token`,
    method: "post"
  })
}

const installComponentsBatch = (componentIds: number[]) => {
  return request<ApiResponse<{ downloadUrl: string }>>({
    url: "/components/install/batch/stream-token",
    method: "post",
    data: { componentIds }
  })
}

export { getComponents, installComponent, installComponentsBatch }
