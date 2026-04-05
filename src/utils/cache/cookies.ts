import CacheKey from "@/constants/cache-key"
import Cookies from "js-cookie"

export const getToken = () => {
  return Cookies.get("token")
}

export const setToken = (token: string) => {
  Cookies.set("token", token)
}

export const removeToken = () => {
  Cookies.remove("token")
}

export const setUsername = (username: string) => {
  Cookies.set(CacheKey.USERNAME, username)
}

export const getUsername = () => {
  return Cookies.get(CacheKey.USERNAME)
}

export const removeUsername = () => {
  Cookies.remove(CacheKey.USERNAME)
}

export const setUserId = (userId: number) => {
  Cookies.set(CacheKey.USER_ID, String(userId))
}

export const getUserId = (): number | null => {
  const userId = Cookies.get(CacheKey.USER_ID)
  if (!userId) return null

  const parsedUserId = Number(userId)
  return Number.isFinite(parsedUserId) ? parsedUserId : null
}

export const removeUserId = () => {
  Cookies.remove(CacheKey.USER_ID)
}

export const setRoles = (roles: string[]) => {
  Cookies.set(CacheKey.ROLES, JSON.stringify(roles))
}

export const getRoles = (): string[] => {
  const roles = Cookies.get(CacheKey.ROLES)
  return roles ? JSON.parse(roles) : []
}

export const removeRoles = () => {
  Cookies.remove(CacheKey.ROLES)
}

export const setTaskPermission = (taskPermission: number) => {
  Cookies.set(CacheKey.TASK_PERMISSION, String(taskPermission))
}

export const getTaskPermission = (): number => {
  const taskPermission = Cookies.get(CacheKey.TASK_PERMISSION)
  return taskPermission ? Number(taskPermission) : 0
}

export const removeTaskPermission = () => {
  Cookies.remove(CacheKey.TASK_PERMISSION)
}
