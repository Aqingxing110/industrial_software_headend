<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { type FormInstance, FormRules, ElMessage } from "element-plus"
import { User, Lock, Key, Picture, Loading } from "@element-plus/icons-vue"
import { getLoginCodeApi } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import { v4 as uuidv4 } from "uuid" // 导入uuid生成函数

const router = useRouter()

/** 登录表单元素的引用 */
const loginFormRef = ref<FormInstance | null>(null)

/** 登录按钮 Loading */
const loading = ref(false)
/** 验证码图片 URL */
const codeUrl = ref("")
/** 验证码Key */
const verifyKey = ref("")

// 登录表单数据
const loginFormData = reactive({
  username: "",
  password: "",
  verificationCode: "",
  key: ""
})

/** 登录表单校验规则 */
const loginFormRules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 16, message: "密码长度应在6到16个字符之间", trigger: "blur" }
  ],
  verificationCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
}

/** 登录逻辑 */
const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      loginFormData.key = verifyKey.value

      useUserStore()
        .login(loginFormData)
        .then(() => {
          router.push({ path: "/" })
        })
        .catch((errorMessage: string) => {
          createCode()
          loginFormData.password = ""
          loginFormData.verificationCode = ""
          ElMessage.error(errorMessage || "登录失败，请重试")
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}

/** 注册逻辑 */
const toregister = () => {
  router.push({ path: "/register" })
}

/** 创建验证码 */
const createCode = () => {
  // 使用uuidv4生成唯一key
  verifyKey.value = uuidv4()

  loginFormData.verificationCode = ""
  codeUrl.value = ""

  getLoginCodeApi({ key: verifyKey.value })
    .then((res) => {
      codeUrl.value = res.data
    })
    .catch((error) => {
      console.error("获取验证码失败:", error)
      ElMessage.error("获取验证码失败，请重试")
    })
}

/** 初始化验证码 */
onMounted(() => {
  createCode()
})
</script>

<template>
  <div class="login-container">
    <ThemeSwitch class="theme-switch" />
    <div class="login-card">
      <div class="title">
        <img src="@/assets/layouts/logos1.jpg" style="width: 110px; height: 60px; margin-right: 10px" />
        <h2>航空专用动力学仿真软件</h2>
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
          <el-form-item prop="verificationCode">
            <!-- 修改字段名 -->
            <el-input
              v-model.trim="loginFormData.verificationCode"
              placeholder="验证码"
              type="text"
              tabindex="3"
              :prefix-icon="Key"
              maxlength="7"
              size="large"
            >
              <template #append>
                <div class="code-image-wrapper">
                  <el-image
                    :src="'data:image/*;base64,' + codeUrl"
                    @click="createCode"
                    class="code-image"
                    draggable="false"
                  >
                    <template #placeholder>
                      <el-icon>
                        <Picture />
                      </el-icon>
                    </template>
                    <template #error>
                      <el-icon>
                        <Loading />
                      </el-icon>
                    </template>
                  </el-image>
                </div>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="button-group">
            <div class="button-container">
              <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin" class="login-btn"
                >登录</el-button
              >
              <el-button type="primary" size="large" @click.prevent="toregister" class="register-btn">注册</el-button>
            </div>
          </el-form-item>
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
      padding: 20px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .el-form {
        width: 100%;

        .el-form-item {
          margin-bottom: 18px;
          width: 100%;

          &:last-child {
            margin-bottom: 0;
          }
        }

        .button-group {
          margin-top: 20px;
          width: 100%;

          .button-container {
            display: flex;
            flex-direction: column; /* 改为垂直布局 */
            gap: 12px;
            width: 100%;

            .el-button {
              width: 100%; /* 按钮宽度填满容器 */
              margin: 0;
              height: 40px;
            }
          }
        }
      }
    }
  }
}

.code-image-wrapper {
  width: 140px;
  height: 40px;
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #ebedf0;
  }

  .code-image {
    width: 100%;
    height: 100%;

    :deep(.el-image__inner) {
      object-fit: cover;
      transform: scale(1.1);
      transition: transform 0.3s;
    }

    &:hover :deep(.el-image__inner) {
      transform: scale(1.15); // 悬停时轻微放大
    }
  }
}

.el-form-item.prop-verificationCode {
  :deep(.el-input-group__append) {
    padding: 0;
    border-left: none;
  }

  .el-input {
    --el-input-right-padding: 145px;

    :deep(.el-input__wrapper) {
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}
</style>
