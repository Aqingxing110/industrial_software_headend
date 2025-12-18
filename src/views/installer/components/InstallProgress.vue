<template>
  <div class="install-progress">
    <h3>正在安装组件</h3>

    <!-- 进度条 -->
    <div class="progress-container">
      <el-progress
        :percentage="installerStore.state.installationProgress"
        :status="installerStore.state.installationStatus === 'failed' ? 'exception' : undefined"
        :stroke-width="8"
        class="progress-bar"
      />
      <div class="progress-text">
        {{ installerStore.state.installationProgress }}%
        <span v-if="installerStore.state.installationStatus === 'failed'" class="error-text"> 安装失败 </span>
      </div>
    </div>

    <!-- 错误处理 -->
    <div v-if="installerStore.state.installationStatus === 'failed'" class="error-handler">
      <el-alert
        title="安装错误"
        :description="installerStore.state.errorMessage"
        type="error"
        show-icon
        class="error-alert"
      />
      <div class="error-actions">
        <el-button type="primary" @click="installerStore.retryInstall">重试</el-button>
        <el-button @click="installerStore.skipError">跳过</el-button>
        <el-button @click="$emit('prev')">返回</el-button>
      </div>
    </div>

    <!-- 安装日志 -->
    <div class="log-container">
      <h4>安装日志</h4>
      <div class="log-content" ref="logRef">
        <p v-for="(log, index) in installerStore.state.installationLog" :key="index" class="log-item">
          {{ log }}
        </p>
      </div>
    </div>

    <!-- 完成按钮（安装成功时显示） -->
    <div v-if="installerStore.state.installationStatus === 'success'" class="progress-footer">
      <el-button type="primary" @click="$emit('next')"> 查看结果 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue"
import { useInstallerStore } from "@/store/modules/installer"

const installerStore = useInstallerStore()
const _emit = defineEmits(["prev", "next"])
const logRef = ref<HTMLDivElement>()

// 自动滚动日志到底部
watch(
  () => installerStore.state.installationLog.length,
  () => {
    nextTick(() => {
      if (logRef.value) {
        logRef.value.scrollTop = logRef.value.scrollHeight
      }
    })
  }
)
</script>

<style scoped lang="scss">
.install-progress {
  h3 {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 600;
  }

  .progress-container {
    margin-bottom: 30px;

    .progress-bar {
      margin-bottom: 10px;
    }

    .progress-text {
      text-align: center;
      font-size: 14px;

      .error-text {
        color: #f56c6c;
        margin-left: 10px;
      }
    }
  }

  .error-handler {
    margin-bottom: 30px;

    .error-alert {
      margin-bottom: 20px;
    }

    .error-actions {
      display: flex;
      gap: 10px;
    }
  }

  .log-container {
    margin-top: 30px;

    h4 {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 600;
    }

    .log-content {
      height: 200px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 10px;
      overflow-y: auto;
      background: #f9fafb;
      font-family: monospace;
      font-size: 13px;

      .log-item {
        margin: 0;
        line-height: 1.5;
        white-space: pre-wrap;
      }
    }
  }

  .progress-footer {
    margin-top: 30px;
    text-align: right;
  }
}
</style>
