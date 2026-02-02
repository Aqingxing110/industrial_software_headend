import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { usePermissionStore } from "./permission"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import {
  getToken,
  removeToken,
  setToken,
  getUsername,
  setUsername,
  removeUsername,
  getRoles,
  setRoles,
  removeRoles
} from "@/utils/cache/cookies"
import { resetRouter } from "@/router"
import { loginApi } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import { RegisterRequestData } from "@/api/register/types/register"
import { registerApi } from "@/api/register"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "") // 用户令牌
  const roles = ref<string[]>(getRoles() || []) // 用户角色列表
  const username = ref<string>(getUsername() || "") // 用户名

  const permissionStore = usePermissionStore()
  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  /** 登录 */
  const login = async ({ username, password, verificationCode, key }: LoginRequestData) => {
    const { data } = await loginApi({ username, password, verificationCode, key })

    // 将 token 设置到 cookie 中
    setToken(data.token)
    token.value = data.token
    setUsername(username)

    // 设置角色，根据 permission 字段判断
    const userRoles = data.permission === 1 ? ["admin"] : ["user"]
    roles.value = userRoles
    setRoles(userRoles)

    console.log(roles.value)

    // 设置动态路由
    permissionStore.setRoutes(roles.value)
  }

  /** 注册 */
  const register = async ({ username, password, phone, permission }: RegisterRequestData) => {
    await registerApi({ username, password, phone, permission })
  }

  /** 切换角色 */
  // const changeRoles = async (role: string) => {
  //   /* const newToken = "token-" + role
  //   token.value = newToken
  //   setToken(newToken)
  //   await getInfo()
  //   permissionStore.setRoutes(roles.value)
  //   resetRouter()
  //   permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
  //     router.addRoute(item)
  //   })
  //   _resetTagsView() */
  // }

  /** 登出 */
  const logout = () => {
    resetToken()
    token.value = ""
    username.value = ""
    resetRouter()
    _resetTagsView()
  }

  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    removeUsername()
    removeRoles()
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

  return { token, roles, username, setRoles, login, logout, resetToken, register }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
