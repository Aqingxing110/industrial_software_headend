import type { LicenseModule, ModuleCategory } from "@/api/license/types/license"

export interface LicenseModuleGroup extends ModuleCategory {
  modules: LicenseModule[]
}

export const LICENSE_MODULE_CATEGORIES: ModuleCategory[] = [
  {
    categoryId: "pre",
    name: "前处理",
    description: "冲击 / 结构 / 多体"
  },
  {
    categoryId: "solver",
    name: "求解器",
    description: "CPU / GPU / 结构 / 多体"
  },
  {
    categoryId: "post",
    name: "后处理",
    description: "通用 / 多体"
  }
]

export const LICENSE_MODULES: LicenseModule[] = [
  {
    moduleId: "pre-impact",
    moduleNo: "PRE-IMP-001",
    name: "冲击前处理",
    categoryId: "pre"
  },
  {
    moduleId: "pre-struct",
    moduleNo: "PRE-STR-002",
    name: "结构前处理",
    categoryId: "pre"
  },
  {
    moduleId: "pre-multibody",
    moduleNo: "PRE-MBD-003",
    name: "多体前处理",
    categoryId: "pre"
  },
  {
    moduleId: "solver-impact-cpu",
    moduleNo: "SOL-IMP-CPU",
    name: "冲击求解器cpu",
    categoryId: "solver"
  },
  {
    moduleId: "solver-impact-gpu",
    moduleNo: "SOL-IMP-GPU",
    name: "冲击求解器gpu",
    categoryId: "solver"
  },
  {
    moduleId: "solver-struct",
    moduleNo: "SOL-STR-001",
    name: "结构求解器",
    categoryId: "solver"
  },
  {
    moduleId: "solver-multibody",
    moduleNo: "SOL-MBD-001",
    name: "多体求解器",
    categoryId: "solver"
  },
  {
    moduleId: "post-general",
    moduleNo: "POST-GEN-001",
    name: "通用后处理",
    categoryId: "post"
  },
  {
    moduleId: "post-multibody",
    moduleNo: "POST-MBD-002",
    name: "多体后处理",
    categoryId: "post"
  }
]

export const LICENSE_MODULE_GROUPS: LicenseModuleGroup[] = LICENSE_MODULE_CATEGORIES.map((category) => ({
  ...category,
  modules: LICENSE_MODULES.filter((module) => module.categoryId === category.categoryId)
}))
