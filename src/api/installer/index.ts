import { request } from "@/utils/service"
import type { ApiResponse, Component, Data } from "@/api/installer/types"

// 获取未安装组件列表
const getUninstalledComponents = () => {
  return request<ApiResponse<Component[]>>({
    url: "/api/components/uninstalled",
    method: "get"
  })
}

// 获取已安装组件列表
const getInstalledComponents = () => {
  return request<ApiResponse<Component[]>>({
    url: "/api/components/installed",
    method: "get"
  })
}

const installComponents = (data: Data[]) => {
  return request<ApiResponse<void>>({
    url: "/api/components/install",
    method: "get",
    data
  })
}

const uninstallComponents = (data: Data[]) => {
  return request<ApiResponse<void>>({
    url: "/api/components/uninstall",
    method: "get",
    data
  })
}

export { getUninstalledComponents, getInstalledComponents, installComponents, uninstallComponents }
