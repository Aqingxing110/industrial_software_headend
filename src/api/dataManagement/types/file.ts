// 路径：src/api/dataManagement/types/file.ts
export type { FileItem, ApiResponse }

interface FileItem {
  id: string // 文件ID
  fileName: string // 文件名
  fileSize: number // 文件大小（字节）
  description?: string // 文件描述（可选）
  projectId: number // 项目ID（必填）
  projectName?: string // 项目名称（展示用）
  projectType?: "shared" | "private" // 项目类型：共享或私有
  updateTime: string // 上传时间
  hasPreview: boolean // 是否有预览图
  previewImageId?: string // 预览图资源ID
  previewThumbnailId?: string // 缩略图资源ID
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 定义分页数据结构
interface PageData<T> {
  total: number
  records: T[]
}

export type { PageData }
