// 视图组件
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView'),
}

// 路由组件注册
const routerMap = {
  login: {
    authority: '*',
    path: '/login',
    component: () => import('@/pages/login'),
  },
  resetPassword: {
    authority: '*',
    path: '/reset-password',
    component: () => import('@/pages/resetPassword'),
  },
  root: {
    path: '/',
    redirect: '/login',
    component: view.tabs,
  },
  dashboard: {
    name: 'dashboard',
    icon: 'dashboard',
    component: view.page,
  },
  cartographie: {
    name: 'cartographie',
    path: 'cartographie',
    icon: 'dashboard',
    component: () => import('@/pages/dashboard/cartographie'),
  },
  details: {
    name: '详情页',
    icon: 'profile',
    component: view.blank,
  },
  result: {
    name: '结果页',
    icon: 'check-circle-o',
    component: view.page,
  },
  exception: {
    name: '异常页',
    icon: 'warning',
    component: view.blank,
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: () => import('@/pages/exception/403'),
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: () => import('@/pages/exception/404'),
  },
  exp500: {
    name: 'exp500',
    path: '500',
    component: () => import('@/pages/exception/500'),
  },
  components: {
    name: '小组件',
    icon: 'appstore-o',
    component: view.page,
  },
}
export default routerMap
