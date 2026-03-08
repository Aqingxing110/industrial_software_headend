import { ref } from "vue"

export const hasAddedDynamicRoutes = ref(false)

export const resetDynamicRouteState = () => {
  hasAddedDynamicRoutes.value = false
}
