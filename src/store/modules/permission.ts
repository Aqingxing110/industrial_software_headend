import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { type RouteRecordRaw } from "vue-router"
import { constantRoutes, asyncRoutes } from "@/router"
import { flatMultiLevelRoutes } from "@/router/helper"
import routeSettings from "@/config/route"

/**
 * 判断用户角色是否有权限访问路由
 * @param roles 用户角色列表
 * @param route 路由配置
 * @returns 是否有权限
 */
const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  const routeRoles = route.meta?.roles
  return routeRoles ? roles.some((role) => routeRoles.includes(role)) : true
}

/**
 * 过滤异步路由
 * @param routes 待过滤的路由列表
 * @param roles 用户角色列表
 * @returns 过滤后的路由
 */
const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tempRoute = { ...route }
    if (hasPermission(roles, tempRoute)) {
      if (tempRoute.children) {
        tempRoute.children = filterAsyncRoutes(tempRoute.children, roles)
      }
      res.push(tempRoute)
    }
  })
  return res
}

export const usePermissionStore = defineStore("permission", () => {
  // 存储最终合并的路由
  const routes = ref<RouteRecordRaw[]>([])
  // 存储动态路由（用于路由缓存等场景）
  const dynamicRoutes = ref<RouteRecordRaw[]>([])

  /**
   * 设置路由
   * @param roles 用户角色列表
   */
  const setRoutes = (roles: string[]) => {
    const accessedRoutes = routeSettings.async ? filterAsyncRoutes(asyncRoutes, roles) : asyncRoutes
    routes.value = constantRoutes.concat(accessedRoutes)
    dynamicRoutes.value = routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(accessedRoutes) : accessedRoutes
  }

  return { routes, dynamicRoutes, setRoutes }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
