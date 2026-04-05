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
  getUserId,
  setUserId,
  removeUserId,
  getRoles,
  setRoles,
  removeRoles,
  getTaskPermission,
  setTaskPermission,
  removeTaskPermission
} from "@/utils/cache/cookies"
import { resetRouter } from "@/router"
import { resetDynamicRouteState } from "@/router/dynamic-route-state"
import { loginApi } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import type { RegisterRequestData } from "@/api/register/types/register"
import { registerApi } from "@/api/register"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>(getRoles() || [])
  const username = ref<string>(getUsername() || "")
  const userId = ref<number | null>(getUserId())
  const taskPermission = ref<number>(getTaskPermission() || 0)

  const permissionStore = usePermissionStore()
  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  const login = async ({ username: loginUsername, password, verificationCode, key }: LoginRequestData) => {
    const { data } = await loginApi({ username: loginUsername, password, verificationCode, key })

    setToken(data.token)
    token.value = data.token

    const resolvedUsername = data.username || loginUsername
    setUsername(resolvedUsername)
    username.value = resolvedUsername

    userId.value = typeof data.userId === "number" ? data.userId : null
    if (userId.value === null) {
      removeUserId()
    } else {
      setUserId(userId.value)
    }

    const userRoles = data.permission === 1 ? ["admin"] : ["user"]
    roles.value = userRoles
    setRoles(userRoles)

    const userTaskPermission = typeof data.taskPermission === "number" ? data.taskPermission : 0
    taskPermission.value = userTaskPermission
    setTaskPermission(userTaskPermission)

    permissionStore.setRoutes(roles.value)
  }

  const register = async ({ username, password, phone, permission }: RegisterRequestData) => {
    await registerApi({ username, password, phone, permission })
  }

  const logout = () => {
    resetToken()
    resetRouter()
    _resetTagsView()
  }

  const resetToken = () => {
    removeToken()
    removeUsername()
    removeUserId()
    removeRoles()
    removeTaskPermission()
    resetDynamicRouteState()
    token.value = ""
    username.value = ""
    userId.value = null
    roles.value = []
  }

  const _resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return { token, roles, username, userId, taskPermission, setRoles, login, logout, resetToken, register }
})

export function useUserStoreHook() {
  return useUserStore(store)
}
