export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PageData<T> {
  records: T[]
  total: number
  size: number
  current: number
}

export interface User {
  userId: number
  username: string
  phone: string
}
