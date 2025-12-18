const SYSTEM_NAME = "v3-admin-vite"

/** 缓存数据时用到的 Key */
class CacheKey {
  static readonly TOKEN = `${SYSTEM_NAME}-token-key`
  static readonly CONFIG_LAYOUT = `${SYSTEM_NAME}-config-layout-key`
  static readonly SIDEBAR_STATUS = `${SYSTEM_NAME}-sidebar-status-key`
  static readonly ACTIVE_THEME_NAME = `${SYSTEM_NAME}-active-theme-name-key`
  static readonly VISITED_VIEWS = `${SYSTEM_NAME}-visited-views-key`
  static readonly CACHED_VIEWS = `${SYSTEM_NAME}-cached-views-key`
  static readonly USERNAME = `${SYSTEM_NAME}-username-key` // 添加用户名的键
  static readonly ROLES = `${SYSTEM_NAME}-roles-key` // 新增角色的缓存键
}

export default CacheKey
