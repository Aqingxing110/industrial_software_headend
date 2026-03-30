<script setup lang="ts">
import { computed, reactive, ref } from "vue"
import { ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import type { LicenseRequestPayload } from "@/api/license/types/license"
import { createLicenseRequestApi, createLicenseRequestMock } from "@/api/license"
import { LICENSE_MODULE_GROUPS, LICENSE_MODULES } from "@/constants/license-catalog"
import { useUserStoreHook } from "@/store/modules/user"

interface ModuleValidityState {
  validDateRange: string[]
  customized: boolean
}

interface SelectedModuleCard {
  moduleId: string
  moduleName: string
  categoryId: string
  categoryName: string
  validDateRange: string[]
  customized: boolean
  isPrimary: boolean
}

const userStore = useUserStoreHook()
const moduleMap = new Map(LICENSE_MODULES.map((item) => [item.moduleId, item]))
const categoryMap = new Map(LICENSE_MODULE_GROUPS.map((item) => [item.categoryId, item]))

const dialogVisible = ref(false)
const loading = ref(false)
const formRef = ref<FormInstance>()
const durationErrorMessage = ref("")
const moduleValidityMap = reactive<Record<string, ModuleValidityState>>({})

const form = reactive({
  customerName: "",
  macAddress: "",
  selectedModuleIds: [] as string[]
})

const firstSelectedModuleId = computed(() => form.selectedModuleIds[0] ?? "")

const selectedModules = computed<SelectedModuleCard[]>(() =>
  form.selectedModuleIds
    .map((moduleId) => {
      const module = moduleMap.get(moduleId)
      if (!module) return null

      return {
        moduleId: module.moduleId,
        moduleName: module.name,
        categoryId: module.categoryId,
        categoryName: categoryMap.get(module.categoryId)?.name ?? module.categoryId,
        validDateRange: moduleValidityMap[moduleId]?.validDateRange ?? [],
        customized: moduleValidityMap[moduleId]?.customized ?? false,
        isPrimary: firstSelectedModuleId.value === module.moduleId
      }
    })
    .filter((item): item is SelectedModuleCard => item !== null)
)

const rules: FormRules = {
  customerName: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
  macAddress: [{ required: true, message: "请输入MAC地址", trigger: "blur" }],
  selectedModuleIds: [
    {
      type: "array",
      required: true,
      message: "请至少选择一个模块",
      trigger: "change"
    }
  ]
}

const cloneDateRange = (dateRange?: string[] | null) => {
  if (!Array.isArray(dateRange)) return []
  return dateRange.filter(Boolean).slice(0, 2)
}

const isSameDateRange = (source: string[], target: string[]) =>
  source.length === target.length && source.every((item, index) => item === target[index])

const clearModuleValidityMap = () => {
  Object.keys(moduleValidityMap).forEach((moduleId) => {
    delete moduleValidityMap[moduleId]
  })
}

const refreshDurationError = () => {
  if (!form.selectedModuleIds.length) {
    durationErrorMessage.value = ""
    return
  }

  const missingDateModule = selectedModules.value.find((item) => item.validDateRange.length !== 2)
  durationErrorMessage.value = missingDateModule ? `请为模块“${missingDateModule.moduleName}”选择使用期限` : ""
}

const validateDurationRanges = () => {
  refreshDurationError()
  return !durationErrorMessage.value
}

const isModuleSelected = (moduleId: string) => form.selectedModuleIds.includes(moduleId)

const toggleModuleSelection = (moduleId: string) => {
  const currentIndex = form.selectedModuleIds.indexOf(moduleId)

  if (currentIndex >= 0) {
    form.selectedModuleIds.splice(currentIndex, 1)
    delete moduleValidityMap[moduleId]
  } else {
    const inheritedDateRange = firstSelectedModuleId.value
      ? cloneDateRange(moduleValidityMap[firstSelectedModuleId.value]?.validDateRange)
      : []

    form.selectedModuleIds.push(moduleId)
    moduleValidityMap[moduleId] = {
      validDateRange: inheritedDateRange,
      customized: false
    }
  }

  refreshDurationError()

  if (formRef.value) {
    void formRef.value.validateField("selectedModuleIds").catch(() => undefined)
  }
}

const syncInheritedDateRanges = (sourceModuleId: string, dateRange: string[]) => {
  form.selectedModuleIds.forEach((moduleId) => {
    if (moduleId === sourceModuleId) return

    const state = moduleValidityMap[moduleId]
    if (!state || state.customized) return

    state.validDateRange = cloneDateRange(dateRange)
  })
}

const handleModuleDateChange = (moduleId: string, dateRange: string[] | null) => {
  const nextDateRange = cloneDateRange(dateRange)
  const currentState = moduleValidityMap[moduleId] ?? {
    validDateRange: [],
    customized: false
  }

  currentState.validDateRange = nextDateRange
  moduleValidityMap[moduleId] = currentState

  if (moduleId === firstSelectedModuleId.value) {
    currentState.customized = false
    syncInheritedDateRanges(moduleId, nextDateRange)
  } else if (firstSelectedModuleId.value) {
    const primaryDateRange = cloneDateRange(moduleValidityMap[firstSelectedModuleId.value]?.validDateRange)
    currentState.customized = !isSameDateRange(nextDateRange, primaryDateRange)
  }

  refreshDurationError()
}

const formatDateRangeLabel = (dateRange: string[]) => {
  if (dateRange.length !== 2) return "点击设置时间"
  return `${dateRange[0]} 至 ${dateRange[1]}`
}

const buildPayloads = () =>
  selectedModules.value.map((item) => {
    const [validFrom, validTo] = item.validDateRange
    return {
      moduleId: item.moduleId,
      moduleName: item.moduleName,
      payload: {
        customerName: form.customerName.trim(),
        macAddress: form.macAddress.trim(),
        categoryId: item.categoryId,
        moduleId: item.moduleId,
        validFrom,
        validTo,
        usageCount: 1
      } satisfies LicenseRequestPayload
    }
  })

const keepOnlyFailedModules = (failedModuleIds: string[]) => {
  const failedIdSet = new Set(failedModuleIds)
  form.selectedModuleIds = form.selectedModuleIds.filter((moduleId) => failedIdSet.has(moduleId))

  Object.keys(moduleValidityMap).forEach((moduleId) => {
    if (!failedIdSet.has(moduleId)) {
      delete moduleValidityMap[moduleId]
    }
  })

  refreshDurationError()
}

const resetForm = () => {
  formRef.value?.resetFields()
  form.selectedModuleIds = []
  clearModuleValidityMap()
  durationErrorMessage.value = ""
}

const submitByApi = async (payloads: ReturnType<typeof buildPayloads>) => {
  const results = await Promise.allSettled(payloads.map((item) => createLicenseRequestApi(item.payload)))
  const allRejected = results.every((item) => item.status === "rejected")

  if (allRejected) {
    throw new Error("license request api unavailable")
  }

  const successModuleIds: string[] = []
  const failedModuleIds: string[] = []
  const failedModuleNames: string[] = []

  results.forEach((result, index) => {
    const currentPayload = payloads[index]

    if (result.status === "fulfilled" && result.value.code === 200) {
      successModuleIds.push(currentPayload.moduleId)
      return
    }

    failedModuleIds.push(currentPayload.moduleId)
    failedModuleNames.push(currentPayload.moduleName)
  })

  return {
    successModuleIds,
    failedModuleIds,
    failedModuleNames
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  if (!validateDurationRanges()) return

  const payloads = buildPayloads()

  loading.value = true
  try {
    const { successModuleIds, failedModuleIds, failedModuleNames } = await submitByApi(payloads)

    if (failedModuleIds.length) {
      keepOnlyFailedModules(failedModuleIds)

      if (successModuleIds.length) {
        ElMessage.warning(`已提交 ${successModuleIds.length} 条申请，失败模块：${failedModuleNames.join("、")}`)
      } else {
        ElMessage.error("提交申请失败，请稍后重试")
      }

      return
    }

    if (!successModuleIds.length) {
      ElMessage.error("提交申请失败，请稍后重试")
      return
    }

    ElMessage.success(`已提交 ${successModuleIds.length} 条许可证申请`)
  } catch {
    await Promise.all(
      payloads.map((item) => createLicenseRequestMock(item.payload, userStore.username || "current_user"))
    )
    ElMessage.success(`后端不可用，已使用本地模拟数据提交 ${payloads.length} 条申请`)
  } finally {
    loading.value = false
  }

  dialogVisible.value = false
  resetForm()
}
</script>

<template>
  <div class="license-request-page">
    <div class="page-header">
      <div>
        <h2 class="title">许可证申请</h2>
        <p class="subtitle">固定模块目录，支持多选和单独设置模块期限。</p>
      </div>
      <el-button type="primary" @click="dialogVisible = true">申请许可证</el-button>
    </div>

    <el-alert
      title="首个模块设置的期限会同步给后续新增模块，后续模块也可单独调整。"
      type="info"
      show-icon
      class="info-alert"
      :closable="false"
    />

    <el-dialog
      v-model="dialogVisible"
      title="申请许可证"
      width="min(720px, calc(100vw - 24px))"
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="96px" label-position="left">
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" clearable maxlength="64" />
        </el-form-item>
        <el-form-item label="MAC地址" prop="macAddress">
          <el-input v-model="form.macAddress" placeholder="请输入MAC地址" clearable maxlength="64" />
        </el-form-item>
        <el-form-item label="申请模块" prop="selectedModuleIds" class="module-form-item">
          <div class="module-selection-panel">
            <div class="module-selection-meta">
              <p class="module-selection-tip">按类别勾选模块，可一次提交多项申请。</p>
              <span class="module-selection-count">已选 {{ form.selectedModuleIds.length }} 个模块</span>
            </div>

            <div class="module-group-list">
              <section v-for="group in LICENSE_MODULE_GROUPS" :key="group.categoryId" class="module-group-card">
                <div class="module-group-header">
                  <div>
                    <h3 class="module-group-title">{{ group.name }}</h3>
                    <p class="module-group-desc">{{ group.description }}</p>
                  </div>
                  <span class="module-group-count">{{ group.modules.length }} 个模块</span>
                </div>

                <div class="module-grid">
                  <button
                    v-for="module in group.modules"
                    :key="module.moduleId"
                    type="button"
                    class="module-option"
                    :class="{ 'is-active': isModuleSelected(module.moduleId) }"
                    @click="toggleModuleSelection(module.moduleId)"
                  >
                    <span class="module-option-check">
                      <span class="module-option-dot" />
                    </span>
                    <span class="module-option-copy">
                      <span class="module-option-name">{{ module.name }}</span>
                    </span>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="使用期限" required class="duration-form-item">
          <div class="duration-panel">
            <div v-if="selectedModules.length" class="duration-chip-list">
              <el-popover
                v-for="item in selectedModules"
                :key="item.moduleId"
                placement="bottom-start"
                trigger="click"
                :width="360"
              >
                <template #reference>
                  <button
                    type="button"
                    class="duration-chip"
                    :class="{
                      'is-primary': item.isPrimary,
                      'is-complete': item.validDateRange.length === 2
                    }"
                  >
                    <span class="duration-chip-header">
                      <span class="duration-chip-title">{{ item.categoryName }} / {{ item.moduleName }}</span>
                      <span v-if="item.isPrimary" class="duration-chip-badge">默认同步</span>
                      <span v-else-if="item.customized" class="duration-chip-badge is-customized">单独设置</span>
                    </span>
                    <span class="duration-chip-value">{{ formatDateRangeLabel(item.validDateRange) }}</span>
                  </button>
                </template>

                <div class="duration-popover">
                  <p class="duration-popover-title">{{ item.moduleName }}</p>
                  <p class="duration-popover-tip">
                    {{
                      item.isPrimary
                        ? "设置首个模块期限后，后续新增模块默认沿用该期限。"
                        : "可在默认期限基础上为当前模块单独调整。"
                    }}
                  </p>
                  <el-date-picker
                    :model-value="item.validDateRange"
                    type="daterange"
                    value-format="YYYY-MM-DD"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    unlink-panels
                    :teleported="false"
                    class="duration-picker"
                    @update:model-value="handleModuleDateChange(item.moduleId, $event)"
                  />
                </div>
              </el-popover>
            </div>

            <div v-else class="duration-empty-state">请先在上方选择模块，再点击标签设置每个模块的使用期限。</div>

            <p v-if="durationErrorMessage" class="duration-error">{{ durationErrorMessage }}</p>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.license-request-page {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.title {
  margin: 0;
  font-size: 20px;
}

.subtitle {
  margin: 6px 0 0;
  color: #6b7280;
}

.info-alert {
  margin-bottom: 16px;
}

:deep(.el-dialog) {
  border-radius: 16px;
}

:deep(.el-dialog__body) {
  max-height: calc(84vh - 120px);
  padding-top: 12px;
  overflow-y: auto;
}

:deep(.el-form-item) {
  margin-bottom: 14px;
}

.module-form-item,
.duration-form-item {
  align-items: flex-start;
}

.module-selection-panel,
.duration-panel {
  width: 100%;
}

.module-selection-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.module-selection-tip {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

.module-selection-count {
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef4ff;
  color: #365dc9;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.module-group-list {
  display: grid;
  gap: 8px;
}

.module-group-card {
  padding: 10px 12px;
  border: 1px solid #e5edf6;
  border-radius: 14px;
  background: linear-gradient(180deg, #fbfdff 0%, #f6f9fc 100%);
}

.module-group-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.module-group-title {
  margin: 0;
  font-size: 14px;
  color: #0f172a;
}

.module-group-desc {
  margin: 2px 0 0;
  font-size: 12px;
  color: #64748b;
}

.module-group-count {
  padding: 2px 8px;
  border-radius: 999px;
  background-color: #ffffff;
  color: #64748b;
  font-size: 12px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.module-option {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease,
    background-color 0.2s ease;
}

.module-option:hover {
  border-color: #8ba8ff;
  transform: translateY(-1px);
  box-shadow: 0 8px 14px rgba(15, 23, 42, 0.05);
}

.module-option.is-active {
  border-color: #4c7dff;
  background: linear-gradient(135deg, rgba(76, 125, 255, 0.12), rgba(76, 125, 255, 0.03));
  box-shadow: 0 10px 18px rgba(76, 125, 255, 0.14);
}

.module-option-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 2px solid #bfd0ea;
  border-radius: 50%;
  flex-shrink: 0;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.module-option.is-active .module-option-check {
  border-color: #4c7dff;
  background-color: #4c7dff;
}

.module-option-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;
  opacity: 0;
  transform: scale(0.4);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.module-option.is-active .module-option-dot {
  opacity: 1;
  transform: scale(1);
}

.module-option-copy {
  display: flex;
  min-width: 0;
  text-align: left;
}

.module-option-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.duration-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.duration-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 200px;
  max-width: 100%;
  padding: 9px 12px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.duration-chip:hover {
  border-color: #8ba8ff;
  transform: translateY(-1px);
  box-shadow: 0 8px 14px rgba(15, 23, 42, 0.05);
}

.duration-chip.is-primary {
  border-color: #4c7dff;
  background: linear-gradient(135deg, rgba(76, 125, 255, 0.12), rgba(76, 125, 255, 0.03));
}

.duration-chip.is-complete {
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.05);
}

.duration-chip-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.duration-chip-title {
  font-size: 12px;
  font-weight: 600;
  color: #111827;
}

.duration-chip-badge {
  padding: 1px 7px;
  border-radius: 999px;
  background: #e0ebff;
  color: #335cff;
  font-size: 11px;
  line-height: 18px;
}

.duration-chip-badge.is-customized {
  background: #eef2f7;
  color: #475569;
}

.duration-chip-value {
  font-size: 12px;
  color: #64748b;
}

.duration-empty-state {
  padding: 12px 14px;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
}

.duration-error {
  margin: 6px 0 0;
  color: #f56c6c;
  font-size: 12px;
}

.duration-popover {
  display: grid;
  gap: 8px;
}

.duration-popover-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.duration-popover-tip {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
}

:deep(.duration-picker.el-date-editor) {
  width: 100%;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 12px;
  }

  .module-selection-meta,
  .module-group-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .module-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .duration-chip {
    min-width: calc(50% - 4px);
  }
}

@media (max-width: 560px) {
  .module-grid {
    grid-template-columns: 1fr;
  }

  .duration-chip {
    min-width: 100%;
  }
}
</style>
