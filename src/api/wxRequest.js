// 小程序网络请求模块

// 应用场景：请求的loading状态改变
function changeState (state) {
  if (Object.keys(state).length === 0) return
  Object.keys(state).forEach(key => {
    state[key] = !state[key]
  })
}

export default {
  /**
   * ajax请求方法
   * @param method 请求类型，一般是'POST'
   * @param url
   * @param params
   * @param state Object类型，其属性类型均为Boolean，开始请求是 状态置反 请求结束 在回复之前状态，用于页面加载或tab切换loading控制
   * @param syncConfig 阻塞配置，等待请求结束才能进行其他操作，如支付场景就能用到
   * @returns {Promise<any>}
   */
  request (method, url, params = {}, state = {}, syncConfig) {
    let syncCfg = {}
    if (Object.prototype.toString.call(syncConfig) === '[object Object]') {
      syncCfg = Object.assign({mask: true}, syncConfig)
    }
    syncConfig && wx.showLoading(syncCfg)
    const app = getApp()
    changeState(state)
    let requestTs = this[`${url}Ts`] = new Date().getTime() // 记录请求的时间
    return new Promise((resolve, reject) => {
      wx.request({
        url: url.indexOf('//') > -1 ? url : app.globalData.gatewayServer + url,
        method: method.toUpperCase(),
        dataType: 'json',
        header: {
          'lxy-authtoken': app.globalData.loginInfo.loginToken,
          'lxy-version': '1.01',
          'lxy-appid': 'soul-catcher',
          'Content-Type': 'application/json;charset=utf-8'
        },
        data: params,
        success: res => {
          syncConfig && wx.hideLoading()
          changeState(state)
          res.data._isLastRequest = requestTs === this[`${url}Ts`] // 用于tab频繁切换调用统一接口时，业务层根据该字端取最后一次发出请求的数据为有效数据
          if (res.data.code === '0' && [undefined, '0'].includes(res.data.flag)) {
            resolve(res.data)
          } else if (['-6', '-2'].includes(res.data.code)) { // 未登录统一逻辑
            app.globalData.isLogged = false
            wx.showToast({
              title: '当前账号在其他地方登录，请重新登录',
              icon: 'none',
              duration: 1000
            })
            setTimeout(_ => {
              wx.navigateTo({ url: '/pages/middle-login/main' })
            }, 1000)
            reject(res.data.message)
          } else {
            setTimeout(() => {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
              reject(res.data.message)
            }, 50)
          }
        },
        fail: e => {
          syncConfig && wx.hideLoading()
          changeState(state)
          wx.showToast({
            title: '网络出错',
            icon: 'none',
            duration: 2000
          })
          reject(e || '网络出错')
        }
      })
    })
  },
  post (...arr) {
    return this.request('POST', ...arr)
  },
  get (...arr) {
    return this.request('GET', ...arr)
  }
}
