import config from './config'

let toResolve
let ready

let code

let appConfig = {
  globalData: {
    userType: '', // 0 管理员 1 学生 2 专家 3 家长 [默认为'']
    userInfo: null,
    loginState: 'noLogin', // 'noLogin' 未登录， 'logining' 登陆中， 'fail'登陆失败(用户拒绝)， 'done' 登陆成功
    loginInfo: {
      secret: '',
      loginToken: '',
      userId: '',
      state: '',
      signature: ''
    },
    gatewayServer: config.gatewayServer
  },
  loginInit (callback) { // 获取登录信息
    // mock数据：默认没有登录
    this.globalData.loginState = 'noLogin'

    if (typeof callback !== 'function') {
      return console.error('callback 参数必须是 function')
    }
    if (['logining', 'done'].includes(this.globalData.loginState)) { // 登录成功 或正在登录
      return ready
    }
    // 以下是'noLogin' 未登录情况， 'fail'登陆失败(用户拒绝)
    // 登陆流程
    this.globalData.loginState = 'logining'
    ready = new Promise((resolve, reject) => {
      toResolve = resolve
      wx.$p.login().then(res => res.code)
        .then(authCode => { // 获取code
          code = authCode
        })
        .then(() => wx.$p.getSetting())
        .then(res => { // 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo
            return wx.$p.getUserInfo().then(res => {
              console.log('用户getUserInfo获取的res = ')
              console.log(res)
              this.wyLogin(res)
            })
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
            reject(res)
          }
        })
        .catch(e => {
          console.error(e)
        })
    })
    return ready
  },
  loginfail () { // 登录失败
    let that = this
    wx.showModal({
      title: '登录失败',
      content: '登录失败，请检查您的网络',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          // mock数据：
          let wyres = {
            success: true,
            hasError: false,
            data: {
              secret: '',
              loginToken: '',
              userId: '2323323',
              state: '1',
              userType: '0'
            }
          }
          if (wyres.data && wyres.hasError === false) {
            let data = wyres.data
            that.globalData.loginInfo = {
              secret: data.secret || '',
              loginToken: data.loginToken || '',
              userId: data.userId || '',
              state: ~~data.state // false是临时账号,必须要账号绑定;true是正式账号,正常业务逻辑
            }
            that.globalData.loginState = 'done'
            that.globalData.userInfo = {
              userId: data.userId,
              userType: data.userType
            }
            that.globalData.userType = that.globalData.userInfo.userType
            toResolve()
          }
          // mock结束
        }
      }
    })
    this.globalData.loginState = 'fail'
  },
  wyLogin (re) { // 登录---添加新用户
    wx.$p.request({
      url: this.globalData.gatewayServer + '/json/white/miniprogrom/login',
      header: {
        'appid': 'soul-catcher'
      },
      data: {
        code,
        rawData: re.rawData,
        signature: re.signature, // 使用sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息
        encryptedData: re.encryptedData, // 包括敏感数据在内的完整用户信息的加密数据
        iv: re.iv, // 加密算法的初始向量
        plat: 'mircowx',
        cloudID: re.cloudID // 敏感数据对应的云 ID，开通云开发的小程序才会返回
      }
    }).then(wyres => {
      if (wyres.data && wyres.hasError === false) {
        let data = wyres.data
        this.globalData.loginInfo = {
          secret: data.secret || '',
          loginToken: data.loginToken || '',
          userId: data.userId || '',
          state: ~~data.state // false是临时账号,必须要账号绑定;true是正式账号,正常业务逻辑
        }
        this.globalData.userInfo = {
          userId: data.userId,
          userType: data.userType
        }
        this.globalData.loginState = 'done'
        this.globalData.userType = this.globalData.userInfo.userType
        toResolve()
      } else {
        this.loginfail()
      }
    }).catch((err) => {
      console.log(err)
    })
  }
}

export default appConfig
