import Vue from 'vue'
import App from './App.vue'
import { initRouter } from './router'
// import 'animate.css/source/animate.css'
import './theme/index.less'
// import './assets/styles/tailwind.css'
import 'windi.css'
import Antd from 'ant-design-vue'
import { FormModel } from 'ant-design-vue'
import Viser from 'viser-vue'
import '@/mock'
import store from './store'
import Plugins from '@/plugins'
import { initI18n } from '@/utils/i18n'
import bootstrap from '@/bootstrap'

import VueFusionCharts from 'vue-fusioncharts'
import FusionCharts from 'fusioncharts'
import TimeSeries from 'fusioncharts/fusioncharts.timeseries'
import 'windi.css'

const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('US', 'FR', 'CN')

Vue.use(Antd)
Vue.use(FormModel)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)
// register VueFusionCharts component
Vue.use(VueFusionCharts, FusionCharts, TimeSeries)

bootstrap({ router, store, i18n, message: Vue.prototype.$message })

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
