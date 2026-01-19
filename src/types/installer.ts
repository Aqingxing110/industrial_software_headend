// 组件信息类型
export interface ComponentInfo {
  id: string
  name: string
  description: string
  version: string
  category: string
  size: string
  selected: boolean
  installed: boolean
  installTime?: string
}

// 安装状态类型
export interface InstallState {
  step: number // 当前步骤：0-安装类型 1-组件选择 2-安装中 3-安装结果
  installType: "full" | "custom" // 全量/自定义安装
  installPath: string
  components: ComponentInfo[] // 所有组件列表
  installationProgress: number // 安装进度(0-100)
  installationStatus: "idle" | "installing" | "success" | "failed" // 安装状态
  installationLog: string[] // 安装日志
  errorMessage?: string // 错误信息
  uninstallProgress: number // 卸载进度
}

// 步骤定义
export const INSTALL_STEPS = [
  { name: "安装类型", key: "type" },
  { name: "组件选择", key: "select" },
  { name: "安装中", key: "progress" },
  { name: "安装完成", key: "result" }
] as const
