import config from './config'

let toResolve
let ready

let code

let appConfig = {
  globalData: {
    userType: '3', // 0 管理员 1 学生 2 专家 3 家长 [默认为'']
    userInfo: null,
    loginState: 'noLogin', // 'noLogin' 未登录， 'logining' 登陆中， 'fail'登陆失败(用户拒绝)， 'done' 登陆成功
    loginInfo: {
      secret: '',
      loginToken: '',
      userId: '',
      state: '',
      smsType: '',
      signature: ''
    },
    gatewayServer: config.gatewayServer
  },
  loginInit (callback) {
    if (typeof callback !== 'function') {
      return console.error('callback 参数必须是 function')
    }
    if (['logining', 'done'].includes(this.globalData.loginState)) {
      return ready
    }
    // 登陆流程
    this.globalData.loginState = 'logining'
    ready = new Promise((resolve, reject) => {
      toResolve = resolve
      wx.$p.login().then(res => res.code)
        .then(authCode => {
          code = authCode
        })
        .then(() => wx.$p.getSetting())
        .then(res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo
            return wx.$p.getUserInfo().then(res => this.wyLogin(res))
          }
          if (wx.canIUse('button.open-type.getUserInfo')) {
            callback()
          } else {
            wx.showModal({
              title: '提示',
              content: '请升级微信版本',
              success: function (res) {}
            })
            this.globalData.loginState = 'fail'
            // reject(res)
          }
        })
        .catch(e => {
          console.error(e)
        })
    })
    return ready
  },
  loginfail () {
    wx.showModal({
      title: '登录失败',
      content: '登录失败，请检查您的网络',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
        }
      }
    })
    this.globalData.loginState = 'fail'
  },
  wyLogin (re) {
    wx.$p.request({
      url: this.globalData.gatewayServer + '/json/white/miniprogrom/login',
      header: {
        'appid': 'soul-catcher'
      },
      data: {
        code,
        signature: re.signature,
        encryptedData: re.encryptedData,
        iv: re.iv,
        plat: 'mircowx'
      }
    }).then(wyres => {
      if (wyres.data && wyres.data.hasError === false) {
        let data = wyres.data.data
        this.globalData.loginInfo = {
          secret: data.secret || '',
          loginToken: data.loginToken || '',
          userId: data.userId || '',
          state: ~~data.state, // false是临时账号,必须要账号绑定;true是正式账号,正常业务逻辑
          smsType: data.smsType || ''
        }
        this.globalData.loginState = 'done'
        toResolve()
      } else {
        this.loginfail()
      }
    })

    // wx.vm.$api.common.login({
    //   authCode: code,
    //   signature: re.signature,
    //   encryptedData: re.encryptedData,
    //   iv: re.iv,
    //   plat: 'mircowx'
    // }).then(res => {
    //   let data = res.item
    //   this.globalData.loginInfo = {
    //     secret: data.secret || '',
    //     loginToken: data.loginToken || '',
    //     userId: data.userId || '',
    //     state: data.state, // 0是临时账号,必须要账号绑定;1是正式账号,正常业务逻辑
    //     smsType: data.smsType || ''
    //   }
    //   this.globalData.isLogged = true
    //   toResolve()
    //   this.globalData.logining = false
    // }).catch(e => {
    //   this.loginfail()
    // })
  },
  requestH5api (options) {
    var that = this
    wx.request({
      url: options.url.indexOf('//') > -1 ? options.url : this.globalData.gatewayServer + options.url,
      method: (options.method || 'POST').toUpperCase(),
      dataType: 'json',
      header: {
        'lxy-authtoken': that.globalData.loginInfo.loginToken,
        'lxy-version': '1.01',
        'lxy-appid': 'soul-catcher',
        'Content-Type': 'application/json;charset=utf-8'
      },
      data: options.data || {},
      success: function (re) {
        if (re.statusCode === 200 && re.data) {
          if (re.data.code === '0') {
            options.success(re.data)
          } else {
            wx.showToast({
              title: re.data.message,
              icon: 'none',
              duration: 2000
            })
          }
        }
      },
      fail: options.fail,
      complete: options.complete
    })
  }
}

export default appConfig
