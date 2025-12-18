// 路径：src/api/dataManagement/types/file.ts
export type { FileItem, ApiResponse }

interface FileItem {
  id: string // 文件ID
  fileName: string // 文件名
  fileSize: number // 文件大小（字节）
  updateTime: string // 上传时间
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
