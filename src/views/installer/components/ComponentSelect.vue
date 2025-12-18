<template>
  <div class="component-select">
    <h3>组件选择（{{ installerStore.state.installType }}）</h3>

    <!-- 分类标签 -->
    <el-tabs v-model="activeCategory" type="card" class="category-tabs">
      <el-tab-pane v-for="category in installerStore.categories" :key="category" :label="category">
        <!-- 组件列表 -->
        <el-checkbox-group v-model="selectedIds" class="component-list">
          <el-checkbox
            v-for="component in installerStore.componentsByCategory(category)"
            :key="component.id"
            :label="component.id"
            class="component-item"
          >
            <div class="component-info">
              <div class="component-name">
                {{ component.name }}
                <span class="version">v{{ component.version }}</span>
                <span class="size">({{ component.size }})</span>
              </div>
              <div class="component-desc">{{ component.description }}</div>
            </div>
          </el-checkbox>
        </el-checkbox-group>

        <!-- 分类操作 -->
        <div class="category-actions">
          <el-button type="text" size="small" @click="installerStore.selectAllComponents(category)"> 全选 </el-button>
          <el-button type="text" size="small" @click="installerStore.deselectAllComponents(category)">
            取消全选
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 底部操作 -->
    <div class="bottom-actions">
      <el-button @click="$emit('prev')">上一步</el-button>
      <div class="action-spacer" />
      <el-button type="primary" @click="$emit('next')" :disabled="installerStore.selectedComponents.length === 0">
        下一步
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useInstallerStore } from "@/store/modules/installer"

const installerStore = useInstallerStore()
const _emit = defineEmits(["prev", "next"])
const activeCategory = ref(installerStore.categories[0] || "基础功能组件")
const selectedIds = ref<string[]>([])

// 同步选中状态
watch(
  () => installerStore.selectedComponents.map((c) => c.id),
  (val) => {
    selectedIds.value = val
  },
  { immediate: true }
)

watch(selectedIds, (val) => {
  installerStore.state.components.forEach((c) => {
    c.selected = val.includes(c.id)
  })
})
</script>

<style scoped lang="scss">
.component-select {
  .category-tabs {
    margin: 20px 0;
  }

  .component-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 10px;
  }

  .component-item {
    padding: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    cursor: pointer;
    margin: 0 10px;
    height: auto;

    &:hover {
      background: #f9fafb;
    }
  }

  .component-info {
    margin-left: 20px;

    .component-name {
      font-weight: 500;
      margin-bottom: 5px;

      .version {
        color: #666;
        font-size: 12px;
        margin-left: 8px;
      }

      .size {
        color: #999;
        font-size: 12px;
        margin-left: 8px;
      }
    }

    .component-desc {
      color: #666;
      font-size: 14px;
    }
  }

  .category-actions {
    margin-top: 15px;
    text-align: right;
  }

  .bottom-actions {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
  }

  .action-spacer {
    flex: 1;
  }
}
</style>
