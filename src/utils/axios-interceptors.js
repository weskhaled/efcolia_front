import Cookie from 'js-cookie'
// 401拦截
const resp401 = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(response, options) {
    const { message, router } = options
    if (response.statusCode === 401) {
      message.error('No permission for this interface')
      router.push('/')
    }
    return response
  },
  /**
   * 响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error) {
    // const {message} = options
    // message.error(error.message)
    return Promise.reject(error)
  }
}

const resp403 = {
  onFulfilled(response, options) {
    const { message } = options
    if (response.statusCode === 403) {
      message.error(`Request denied`)
    }
    return response
  }
}

const reqCommon = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(config, options) {
    const { message, router } = options
    const { url, xsrfCookieName } = config
    if ((url.indexOf('login') === -1 && url.indexOf('reset-password') === -1) && xsrfCookieName && !Cookie.get(xsrfCookieName)) {
      message.warning('The authentication token has expired, please log in again')
      router.push('/')
    }
    return config
  },
  /**
   * 请求出错时做点什么
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const { message } = options
    message.error(error.message)
    return Promise.reject(error)
  }
}

export default {
  request: [reqCommon], // 请求拦截
  response: [resp401, resp403] // 响应拦截
}
