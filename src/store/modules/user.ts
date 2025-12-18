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
import { createWebHistory, type RouteRecordRaw } from "vue-router"
import routeSettings from "@/config/route"
import { RegisterRequestData } from "@/api/register/types/register"
import { registerApi } from "@/api/register"

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

    // 设置角色，根据 permission 字段判断
    if (data.permission === 1) {
      // 如果 permission 是 1，设置为 admin 角色
      roles.value = ["admin"]
    } else {
      // 如果 permission 是 0，设置为 user 角色
      roles.value = ["user"]
    }

    console.log(roles.value)

    // 设置动态路由
    permissionStore.setRoutes(roles.value)
  }

  /** 注册 */
  const register = async ({ username, password, phone, permission }: RegisterRequestData) => {
    await registerApi({ username, password, phone, permission })
  }

  /** 切换角色 */
  const changeRoles = async (role: string) => {
    /* const newToken = "token-" + role
    token.value = newToken
    setToken(newToken)
    await getInfo()
    permissionStore.setRoutes(roles.value)
    resetRouter()
    permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })
    _resetTagsView() */
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

  return { token, roles, username, setRoles, login, changeRoles, logout, resetToken, register }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
