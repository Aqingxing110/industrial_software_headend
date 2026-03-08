const SYSTEM_NAME = "v3-admin-vite"

class CacheKey {
  static readonly TOKEN = `${SYSTEM_NAME}-token-key`
  static readonly CONFIG_LAYOUT = `${SYSTEM_NAME}-config-layout-key`
  static readonly SIDEBAR_STATUS = `${SYSTEM_NAME}-sidebar-status-key`
  static readonly ACTIVE_THEME_NAME = `${SYSTEM_NAME}-active-theme-name-key`
  static readonly VISITED_VIEWS = `${SYSTEM_NAME}-visited-views-key`
  static readonly CACHED_VIEWS = `${SYSTEM_NAME}-cached-views-key`
  static readonly USERNAME = `${SYSTEM_NAME}-username-key`
  static readonly USER_ID = `${SYSTEM_NAME}-user-id-key`
  static readonly ROLES = `${SYSTEM_NAME}-roles-key`
}

export default CacheKey
