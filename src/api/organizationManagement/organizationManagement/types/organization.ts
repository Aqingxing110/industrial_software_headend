// 路径：src/api/organizationManagement/types/organization.ts
export type { Organization, Member, ApiResponse }
interface Organization {
  orgId: string
  orgName: string
  creator: string
  createTime: string
}

interface Member {
  userId: string
  userName: string
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
