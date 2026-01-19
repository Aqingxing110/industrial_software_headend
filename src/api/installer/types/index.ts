interface Component {
  id: number
  name: string
  version: string
  size: string
  installTime?: string
  description: string
  dynamicsDirection?: string
  moduleType?: string
  resourceType?: string
}

interface Data {
  id: number
  dynamicsDirection?: string
  moduleType?: string
  resourceType?: string
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export type { Component, Data, ApiResponse }
