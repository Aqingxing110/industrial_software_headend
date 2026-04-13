<script lang="ts" setup>
import { computed } from "vue"
import { type RouteRecordRaw } from "vue-router"
import SidebarItemLink from "./SidebarItemLink.vue"
import { isExternal } from "@/utils/validate"
import path from "path-browserify"

interface Props {
  item: RouteRecordRaw
  isCollapse?: boolean
  isTop?: boolean
  isFirstLevel?: boolean
  basePath?: string
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  isCollapse: false,
  isTop: false,
  isFirstLevel: true,
  basePath: "",
  level: 1
})

/** 是否始终显示根菜单 */
const alwaysShowRootMenu = computed(() => props.item.meta?.alwaysShow)

/** 显示的子菜单 */
const showingChildren = computed(() => {
  return props.item.children?.filter((child) => !child.meta?.hidden) ?? []
})

/** 显示的子菜单数量 */
const showingChildNumber = computed(() => {
  return showingChildren.value.length
})

/** 唯一的子菜单项 */
const theOnlyOneChild = computed(() => {
  const number = showingChildNumber.value
  switch (true) {
    case number > 1:
      return null
    case number === 1:
      return showingChildren.value[0]
    default:
      return { ...props.item, path: "" }
  }
})

/** 解析路径 */
const resolvePath = (routePath: string) => {
  switch (true) {
    case isExternal(routePath):
      return routePath
    case isExternal(props.basePath):
      return props.basePath
    default:
      return path.resolve(props.basePath, routePath)
  }
}
</script>

<template>
  <div
    v-if="!props.item.meta?.hidden"
    :class="{ 'simple-mode': props.isCollapse && !isTop, 'first-level': props.isFirstLevel }"
    :style="{ 'padding-left': `${(props.level - 1) * 10}px` }"
  >
    <template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children">
      <SidebarItemLink v-if="theOnlyOneChild.meta" :to="resolvePath(theOnlyOneChild.path)">
        <el-menu-item :index="resolvePath(theOnlyOneChild.path)">
          <SvgIcon v-if="theOnlyOneChild.meta.svgIcon" :name="theOnlyOneChild.meta.svgIcon" />
          <component v-else-if="theOnlyOneChild.meta.elIcon" :is="theOnlyOneChild.meta.elIcon" class="el-icon" />
          <template v-if="theOnlyOneChild.meta.title" #title>
            {{ theOnlyOneChild.meta.title }}
          </template>
        </el-menu-item>
      </SidebarItemLink>
    </template>
    <el-sub-menu v-else :index="resolvePath(props.item.path)" teleported>
      <template #title>
        <SvgIcon v-if="props.item.meta?.svgIcon" :name="props.item.meta.svgIcon" />
        <component v-else-if="props.item.meta?.elIcon" :is="props.item.meta.elIcon" class="el-icon" />
        <span v-if="props.item.meta?.title">{{ props.item.meta.title }}</span>
      </template>
      <template v-if="props.item.children">
        <sidebar-item
          v-for="child in props.item.children"
          :key="child.path"
          :item="child"
          :is-collapse="props.isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
          :level="props.level + 1"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<style lang="scss" scoped>
// 原有样式保留，新增/修改以下样式
.svg-icon {
  min-width: 1em;
  margin-right: 12px;
  font-size: 18px;
}

.el-icon {
  width: 1em;
  margin-right: 12px;
  font-size: 18px;
}

// 核心：调整子菜单箭头位置
:deep(.el-sub-menu) {
  .el-sub-menu__title {
    // 让标题容器变成弹性布局，方便箭头左移
    display: flex;
    align-items: center;
    // 预留箭头位置（可选，根据需求调整）
    padding-left: 0 !important;
  }

  // 箭头默认在右侧，强制移到左侧
  .el-sub-menu__icon-arrow {
    position: static !important;
    order: -1;
    margin-right: 8px !important;
    margin-left: 8px !important;
    transition: transform 0.3s;
  }
}

.simple-mode {
  &.first-level {
    :deep(.el-sub-menu) {
      .el-sub-menu__icon-arrow {
        display: none;
      }
      span {
        visibility: hidden;
      }
    }
  }
}
</style>
