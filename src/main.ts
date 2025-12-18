// core
import { createApp } from "vue"
import App from "@/App.vue"

// import OpenLayersMap from "vue3-openlayers"
// import ol from "./views/menu/menu1/menu1-1/v4.6.5-dist/ol"
import "vue3-openlayers/styles.css" // vue3-openlayers version < 1.0.0-*
import { type Vue3OpenlayersGlobalOptions } from "vue3-openlayers"
import store from "@/store"
import router from "@/router"
import "@/router/permission"
// load
import { loadSvg } from "@/icons"
import { loadPlugins } from "@/plugins"
import { loadDirectives } from "@/directives"
// css
import "uno.css"
import "normalize.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "vxe-table/lib/style.css"
import "vxe-table-plugin-element/dist/style.css"
import "@/styles/index.scss"

const app = createApp(App)
//app.use(OpenLayersMap /* options */)
//app.use(ol)

const options: Vue3OpenlayersGlobalOptions = {
  debug: true
}
//app.use(OpenLayersMap, options)

/** 加载插件 */
loadPlugins(app)
/** 加载全局 SVG */
loadSvg(app)
/** 加载自定义指令 */
loadDirectives(app)

app.use(store).use(router)
router.isReady().then(() => {
  app.mount("#app")
})
