<template>
  <div class="personal-center-container">
    <!-- 基本资料部分 -->
    <div class="basic-info">
      <h2>基本资料</h2>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本资料" name="basic">
          <div class="user-info">
            <div class="info-item">
              <el-icon><User /></el-icon>
              <span>用户名：</span>
              <span>{{ userInfo.username }}</span>
            </div>
            <div class="info-item">
              <el-icon><Phone /></el-icon>
              <span>手机号：</span>
              <span>{{ userInfo.phone }}</span>
            </div>
            <div class="info-item">
              <el-icon><User /></el-icon>
              <span>权限：</span>
              <span>{{ userInfo.permission === 1 ? "管理员" : "普通用户" }}</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="password">
          <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px" class="demo-ruleForm">
            <!-- 旧密码输入框 -->
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input
                v-model="form.oldPassword"
                placeholder="请输入旧密码"
                show-password
                autocomplete="off"
                style="width: 240px"
              />
            </el-form-item>
            <!-- 新密码输入框 -->
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="form.newPassword"
                placeholder="请输入新密码"
                show-password
                autocomplete="off"
                style="width: 240px"
              />
            </el-form-item>
            <!-- 确认密码输入框 -->
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="form.confirmPassword"
                placeholder="请确认新密码"
                show-password
                autocomplete="off"
                style="width: 240px"
              />
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item>
              <el-button type="primary" @click="submitForm">保存</el-button>
              <el-button @click="resetForm">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { ElForm, ElFormItem, ElInput, ElButton, ElTabs, ElTabPane, ElIcon, ElMessage } from "element-plus"
import { User, Phone } from "@element-plus/icons-vue"
import { getCurrentInstance } from "vue"
import { getUserInfoApi } from "@/api/userInfo" // 假设你有一个获取当前用户信息的 API
import { changePasswordApi } from "@/api/userInfo" // 假设你有一个修改密码的 API

// 表单元素的引用
const formRef = ref<InstanceType<typeof ElForm> | null>(null)

// 表单数据
const form = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
})

// 显式定义 FormRules 类型
import { FormRules } from "element-plus"

// 表单校验规则，使用 FormRules 类型
const formRules: FormRules = {
  oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, max: 16, message: "新密码长度应为6到16位", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value !== form.value.newPassword) {
          callback(new Error("两次输入密码不一致!"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ]
}

// 用于切换选项卡
const activeTab = ref("basic")

// 用户信息
const userInfo = ref({
  username: "",
  phone: "",
  permission: 0 // 0: 普通用户, 1: 管理员
})

// 提交表单方法
const submitForm = async () => {
  const formRefInstance = formRef.value
  if (formRefInstance) {
    formRefInstance.validate(async (valid: boolean) => {
      if (valid) {
        try {
          // 调用修改密码的 API
          const response = await changePasswordApi(form.value.oldPassword, form.value.newPassword)
          console.log("密码修改成功", response)
          // 提示用户密码修改成功
          ElMessage.success("密码修改成功")
        } catch (error) {
          console.error("密码修改失败", error)
          // 提示用户密码修改失败
          ElMessage.error("密码修改失败")
        }
      } else {
        console.log("验证失败，请检查输入")
        return false
      }
    })
  }
}

// 重置表单方法
const resetForm = () => {
  const formRefInstance = formRef.value
  if (formRefInstance) {
    formRefInstance.resetFields()
  }
}

// 在组件挂载时获取用户信息
onMounted(async () => {
  try {
    const response = await getUserInfoApi()
    userInfo.value = response.data // 假设 API 返回的是一个包含用户信息的对象
  } catch (error) {
    console.error("获取用户信息失败:", error)
  }
})
</script>

<style scoped lang="scss">
.personal-center-container {
  display: flex;
  gap: 20px;
}

.basic-info {
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
