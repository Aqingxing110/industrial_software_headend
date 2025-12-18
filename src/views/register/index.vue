<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { type FormInstance, FormRules } from "element-plus"
import { User, Lock, Cellphone } from "@element-plus/icons-vue"
// import { getLoginCodeApi } from "@/api/login"
import { type RegisterRequestData } from "@/api/register/types/register"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"

const router = useRouter()

/** 表单元素的引用 */
const loginFormRef = ref<FormInstance | null>(null)

/** 按钮 Loading */
const loading = ref(false)

/** 注册表单数据，权限默认设置为 0（普通用户） */
const loginFormData: RegisterRequestData = reactive({
  username: "",
  password: "",
  phone: "",
  permission: 0 // 默认权限为 0，表示普通用户
})

/** 注册表单校验规则 */
const loginFormRules: FormRules = {
  username: [{ required: true, message: "Please enter user name", trigger: "blur" }],
  password: [
    { required: true, message: "Please enter password", trigger: "blur" },
    { min: 6, max: 16, message: "Between 6 and 16 characters in length", trigger: "blur" }
  ],
  phone: [
    { required: true, message: "Please enter phone number", trigger: "blur" },
    { pattern: /^1\d{10}$/, message: "Phone number must be 11 digits and start with 1", trigger: "blur" }
  ]
}

/** 注册 */
const handlereg = () => {
  /**验证表单 */
  loginFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      /** useUserStore() 是写好的 状态管理器 Pinia 的 Store
       * login action 返回值是一个 Promise，所以我们后面链式跟一个 .then 、 .catch 和 .finally，接口调用成功则会执行 .then （跳转到首页），如果途中发生错误，则会执行 .catch，而无论什么情况都会执行 .finally
       */
      useUserStore()
        .register(loginFormData)
        /**执行成功，跳转到登录 */
        .then(() => {
          router.push({ path: "/login" })
        })
        .catch(() => {
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

/** 创建验证码 */
// const createCode = () => {
//   // 先清空验证码的输入
//   loginFormData.code = ""
//   // 获取验证码
//   codeUrl.value = ""
//   getLoginCodeApi().then((res) => {
//     codeUrl.value = res.data
//   })
// }

/** 初始化验证码 */
// createCode()
</script>

<template>
  <div class="login-container">
    <ThemeSwitch class="theme-switch" />
    <div class="login-card">
      <div class="title">
        <img src="@/assets/layouts/logos1.jpg" style="width: 110px; height: 60px; margin-right: 10px" />
        <h2>注册</h2>
      </div>
      <div class="content">
        <el-form ref="loginFormRef" :model="loginFormData" :rules="loginFormRules" @keyup.enter="handleLogin">
          <el-form-item prop="username">
            <el-input
              v-model.trim="loginFormData.username"
              placeholder="用户名"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="loginFormData.password"
              placeholder="密码"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item prop="phone">
            <el-input
              v-model.trim="loginFormData.phone"
              placeholder="手机号"
              type="text"
              tabindex="2"
              :prefix-icon="Cellphone"
              size="large"
            />
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handlereg">注册</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .login-card {
    width: 480px;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: #fff;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      img {
        height: 100%;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;
        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
