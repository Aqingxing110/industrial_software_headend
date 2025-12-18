// 路径合法性校验（模拟）
export const validatePath = (path: string): boolean => {
  if (!path) return false
  // 简单校验：包含盘符（Windows）或/（Linux）
  return /^[A-Za-z]:\\|^\//.test(path.trim())
}

// 模拟文件选择对话框（前端模拟）
export const selectPath = async (): Promise<string> => {
  return new Promise((resolve) => {
    // 实际项目中可集成electron的对话框API
    setTimeout(() => {
      resolve("E:\\IndustrialSoftware\\components")
    }, 500)
  })
}
