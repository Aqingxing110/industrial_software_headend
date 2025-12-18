import { useUserStore } from "@/store/modules/user"
import { loginFormRef, loading, loginFormData, router, createCode } from "./index.vue"

/** 登录逻辑 */
export const handleLogin = () => {
  /**验证登录表单 */
  loginFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      /** useUserStore() 是写好的 状态管理器 Pinia 的 Store
       * login action 返回值是一个 Promise，所以我们后面链式跟一个 .then 、 .catch 和 .finally，接口调用成功则会执行 .then （跳转到首页），如果途中发生错误，则会执行 .catch，而无论什么情况都会执行 .finally
       **/
      useUserStore()
        .login(loginFormData)
        .then(() => {
          router.push({ path: "/" })
        })
        .catch(() => {
          createCode()
          loginFormData.password = ""
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
