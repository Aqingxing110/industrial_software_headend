<template>
  <div class="install-config">
    <h3>安装配置</h3>

    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="config-form">
      <el-form-item label="安装路径" prop="installPath">
        <el-input v-model="form.installPath" placeholder="请选择安装路径" class="path-input" />
        <el-button type="primary" @click="browsePath" class="browse-btn"> 浏览 </el-button>
      </el-form-item>

      <el-form-item label="快捷方式">
        <el-checkbox v-model="form.createShortcut">创建桌面快捷方式</el-checkbox>
      </el-form-item>

      <el-form-item label="自动更新">
        <el-checkbox v-model="form.autoUpdate">启用自动更新检查</el-checkbox>
      </el-form-item>
    </el-form>

    <div class="config-summary">
      <h4>安装摘要</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="安装类型">
          {{ installerStore.state.installType === "full" ? "全量安装" : "自定义安装" }}
        </el-descriptions-item>
        <el-descriptions-item label="组件数量"> {{ installerStore.selectedComponents.length }}个 </el-descriptions-item>
        <el-descriptions-item label="目标路径">
          {{ form.installPath || "未设置" }}
        </el-descriptions-item>
        <el-descriptions-item label="预计大小">
          {{ selectedSize }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="config-footer">
      <el-button @click="$emit('prev')">上一步</el-button>
      <div class="footer-spacer" />
      <el-button type="primary" @click="handleNext"> 开始安装 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue"
import { ElForm, ElMessage } from "element-plus"
import { useInstallerStore } from "@/store/modules/installer"
import { selectPath, validatePath } from "@/utils/installer"

const installerStore = useInstallerStore()
const emit = defineEmits(["prev", "next"])
const formRef = ref<InstanceType<typeof ElForm>>()

// 表单数据
const form = reactive({
  installPath: installerStore.state.installPath,
  createShortcut: true,
  autoUpdate: true
})

// 表单校验规则
const rules = {
  installPath: [
    { required: true, message: "请选择安装路径", trigger: "blur" },
    { validator: (rule: any, value: string) => validatePath(value), message: "请输入有效的路径", trigger: "blur" }
  ]
}

// 计算选中组件总大小
const selectedSize = computed(() => {
  const totalKB = installerStore.selectedComponents.reduce((sum, item) => {
    const size = parseInt(item.size) || 0
    return sum + size
  }, 0)
  return totalKB > 1024 ? `${(totalKB / 1024).toFixed(1)}MB` : `${totalKB}KB`
})

// 浏览路径
const browsePath = async () => {
  const path = await selectPath()
  if (path) {
    form.installPath = path
    installerStore.setInstallPath(path)
  }
}

// 下一步处理
const handleNext = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      emit("next")
    } else {
      ElMessage.error("请完善安装配置")
    }
  })
}
</script>

<style scoped lang="scss">
.install-config {
  h3 {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 600;
  }

  .config-form {
    margin-bottom: 30px;

    .path-input {
      width: calc(100% - 100px);
      margin-right: 10px;
    }

    .browse-btn {
      width: 90px;
    }
  }

  .config-summary {
    margin-bottom: 30px;

    h4 {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 600;
    }
  }

  .config-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
  }

  .footer-spacer {
    flex: 1;
  }
}
</style>
