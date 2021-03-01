import Vue from 'vue'
import Router from 'vue-router'
import {formatRoutes} from '@/utils/routerUtil'

Vue.use(Router)

// Route configuration without login interception
const loginIgnore = {
  names: ['404', '403', 'resetPassword'],      //Match by route name
  paths: ['/login', '/reset-password'],   //According to routing fullPath matching
  /**
   * Determine whether the route is included in the configuration
   * @param route vue-router 的 route 对象
   * @returns {boolean}
   */
  includes(route) {
    return this.names.includes(route.name) || this.paths.includes(route.path)
  }
}

/**
 * Initialize routing instance
 * @param isAsync Whether asynchronous routing mode
 * @returns {VueRouter}
 */
function initRouter(isAsync) {
  const options = isAsync ? require('./async/config.async').default : require('./config').default
  formatRoutes(options.routes)
  return new Router(options)
}
export {loginIgnore, initRouter}
