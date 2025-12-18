/** 统一处理 Cookie */

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

export const setUsername = (username) => {
  Cookies.set(CacheKey.USERNAME, username)
}

export const getUsername = () => {
  return Cookies.get(CacheKey.USERNAME)
}
export const removeUsername = () => {
  Cookies.remove(CacheKey.USERNAME)
}

// Roles (添加角色处理函数)
export const setRoles = (roles: string[]) => {
  Cookies.set(CacheKey.ROLES, JSON.stringify(roles))
}

export const getRoles = (): string[] => {
  const roles = Cookies.get(CacheKey.ROLES)
  return roles ? JSON.parse(roles) : [] // 返回解析后的角色数组，若没有，则返回空数组
}

export const removeRoles = () => {
  Cookies.remove(CacheKey.ROLES)
}
