import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { usePermissionStore } from "./permission"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import { getToken, removeToken, setToken, getUsername, setUsername, removeUsername } from "@/utils/cache/cookies"
import router, { resetRouter } from "@/router"
import { loginApi } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import { type RouteRecordRaw } from "vue-router"
import routeSettings from "@/config/route"
import { RegisterRequestData } from "@/api/register/types/register"
import { registerApi } from "@/api/register"
// 如果有接口的话，这里应该引入 getUserInfoApi，例如：
// import { getUserInfoApi } from "@/api/user"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "") // 用户令牌
  const roles = ref<string[]>([]) // 用户角色列表
  const username = ref<string>(getUsername() || "") // 用户名

  const permissionStore = usePermissionStore()
  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  /** 设置角色数组 */
  const setRoles = (value: string[]) => {
    roles.value = value
  }

  /** 登录 */
  const login = async ({ username, password, verificationCode, key }: LoginRequestData) => {
    const { data } = await loginApi({ username, password, verificationCode, key })

    // 将 token 设置到 cookie 中
    setToken(data.token)
    token.value = data.token
    setUsername(username)
    username = username

    // 设置角色，根据 permission 字段判断
    if (data.permission === 1) {
      roles.value = ["admin"]
    } else {
      roles.value = ["user"]
    }

    // 设置动态路由
    permissionStore.setRoutes(roles.value)
  }

  /** 注册 */
  const register = async ({ username, password, phone, permission }: RegisterRequestData) => {
    await registerApi({ username, password, phone, permission })
  }

  /** 获取用户信息（刷新时调用） */
  const getUserInfo = async () => {
    if (!token.value) {
      throw new Error("Token 不存在")
    }

    // 🚨 如果你有后端接口，应该用接口来获取用户信息
    // const { data } = await getUserInfoApi()
    // username.value = data.username
    // roles.value = data.permission === 1 ? ["admin"] : ["user"]

    // 如果暂时没有接口，就用 cookie 恢复
    username.value = getUsername() || ""

    // 简单模拟角色恢复逻辑
    if (username.value === "admin") {
      roles.value = ["admin"]
    } else {
      roles.value = ["user"]
    }

    // 设置动态路由
    permissionStore.setRoutes(roles.value)

    return { username: username.value, roles: roles.value }
  }

  /** 登出 */
  const logout = () => {
    removeToken()
    removeUsername()
    token.value = ""
    username.value = ""
    roles.value = []
    resetRouter()
    _resetTagsView()
  }

  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }

  /** 重置 Visited Views 和 Cached Views  * 重置标签页视图*/
  const _resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return { token, roles, username, setRoles, login,  logout, resetToken, register, getUserInfo }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
