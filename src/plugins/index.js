import VueI18nPlugin from './i18n-extend'
import AuthorityPlugin from './authority-plugin'
import TabsPagePlugin from './tabs-page-plugin'
import MyGmap from './myGmap'
const gMapsKey = process.env.VUE_APP_GMAPS_KEY

const Plugins = {
  install: function(Vue) {
    Vue.use(VueI18nPlugin)
    Vue.use(AuthorityPlugin)
    Vue.use(TabsPagePlugin)
    Vue.use(MyGmap, { key: gMapsKey, libraries: ['places'] })
  },
}
export default Plugins
