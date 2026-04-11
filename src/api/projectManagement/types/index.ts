// 路径：src/api/projectManagement/types/index.ts

/**
 * 项目管理相关类型定义
 */

/**
 * 项目信息
 */
export interface Project {
  projectId: number // 项目ID
  project_name: string // 项目名称
  creation_time: string // 创建时间
  creator: string // 创建者/所有者
  organization?: string | null // 组织名称（共享项目时存在）
  projectStatus?: 0 | 1 // 项目状态：0=共享(shared), 1=私有(private)
}

/**
 * 项目类型枚举
 */
export enum ProjectType {
  Shared = 'SHARED', // 组织公开
  Private = 'PRIVATE' // 私有
}

/**
 * 分页响应数据结构
 */
export interface PaginatedResponse<T> {
  code: number
  message: string
  data: {
    records: T[]
    total: number
    size: number
    current: number
  }
}

/**
 * 通用响应
 */
export interface CommonResponse {
  code: number
  message: string
  data: null
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  pageNum: number
  pageSize: number
  keyword?: string
}
