// 路径：src/api/projectManagement/index.ts

import { request } from "@/utils/service"
import type {
  Project,
  PaginatedResponse,
  CommonResponse,
  PaginationParams,
  CreateProjectParams
} from "@/api/projectManagement/types"

/**
 * 获取共享项目（组织公开）- 分页
 * POST /modProjects/shared/page
 */
export function getSharedProjectsApi(
  params: PaginationParams
): Promise<PaginatedResponse<Project>> {
  return request({
    url: "/modProjects/shared/page",
    method: "post",
    data: params
  })
}

/**
 * 获取私有项目 - 分页
 * POST /modProjects/private/page
 */
export function getPrivateProjectsApi(
  params: PaginationParams
): Promise<PaginatedResponse<Project>> {
  return request({
    url: "/modProjects/private/page",
    method: "post",
    data: params
  })
}

/**
 * 获取可访问项目（共享 + 私有）- 分页
 * 推荐使用此接口获取项目列表
 * POST /modProjects/accessible/page
 */
export function getAccessibleProjectsApi(
  params: PaginationParams
): Promise<PaginatedResponse<Project>> {
  return request({
    url: "/modProjects/accessible/page",
    method: "post",
    data: params
  })
}

/**
 * 创建私有项目
 * POST /modProjects/private/create
 */
export function createPrivateProjectApi(
  projectName: string,
  simulationType: CreateProjectParams["simulation_type"]
): Promise<CommonResponse> {
  return request({
    url: "/modProjects/private/create",
    method: "post",
    data: { project_name: projectName, simulation_type: simulationType }
  })
}

/**
 * 创建共享项目（必须在组织内）
 * POST /modProjects/shared/create
 */
export function createSharedProjectApi(projectName: string, simulationType: CreateProjectParams["simulation_type"]): Promise<CommonResponse> {
  return request({
    url: "/modProjects/shared/create",
    method: "post",
    data: { project_name: projectName, simulation_type: simulationType }
  })
}

/**
 * 项目设为私有（仅创建者）
 * POST /modProjects/shared/{projectId}/encrypt
 */
export function encryptProjectApi(projectId: number): Promise<CommonResponse> {
  return request({
    url: `/modProjects/shared/${projectId}/encrypt`,
    method: "post"
  })
}

/**
 * 项目设为共享（仅创建者且当前在组织内）
 * POST /modProjects/private/{projectId}/decrypt
 */
export function decryptProjectApi(projectId: number): Promise<CommonResponse> {
  return request({
    url: `/modProjects/private/${projectId}/decrypt`,
    method: "post"
  })
}

/**
 * 删除项目（若项目下有文件会失败）
 * DELETE /modProjects/delete/{projectId}
 */
export function deleteProjectApi(projectId: number): Promise<CommonResponse> {
  return request({
    url: `/modProjects/delete/${projectId}`,
    method: "delete"
  })
}
