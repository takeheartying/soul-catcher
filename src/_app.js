import config from './config'
import api from '@/api'
let toResolve
let ready

let code

let appConfig = {
  globalData: {
    userType: '', // 0 管理员 1 学生 2 专家 3 家长 [默认为'']
    userInfo: {
      userId: '',
      userType: '',
      openId: '',
      avatar: ''
    },
    loginState: 'noLogin', // 'noLogin' 未登录， 'logining' 登陆中， 'fail'登陆失败(用户拒绝)， 'done' 登陆成功 , 'temporaryLogin' 临时登录
    loginInfo: {
      secret: '',
      loginToken: '',
      userId: '',
      state: '',
      signature: ''
    },
    gatewayServer: config.gatewayServer
  },
  // initData: 登录或注册需要初始传参
  loginInit (callback) { // 获取登录信息
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
        .then(authCode => { // 获取 临时登录凭证 code -- 只能使用一次
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
  // re: 获取到的用户信息  '在  noLogin' 未登录情况， 'fail'登陆失败(用户拒绝)下进行系统登录
  async wyLogin (re) { // 登录--临时登录【入参-无用户名密码】或正常登录
    // 临时登录：
    await api.user.initLogin({
      code,
      // rawData: re.rawData,
      nickName: re.userInfo.nickName,
      avatarUrl: re.userInfo.avatarUrl,
      signature: re.signature, // 使用sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息
      encryptedData: re.encryptedData, // 包括敏感数据在内的完整用户信息的加密数据
      iv: re.iv, // 加密算法的初始向量
      plat: 'mircowx',
      cloudID: re.cloudID // 敏感数据对应的云ID，开通云开发的小程序才会返回
    }).then(res => {
      if (res && res.data) {
        let wyres = res.data
        this.globalData.loginInfo = {
          openId: wyres.openId || ''
        }
        this.globalData.userInfo = {
          nickName: wyres.nickName,
          avatarUrl: wyres.avatarUrl,
          openId: wyres.openId || ''
        }
        this.globalData.loginState = 'temporaryLogin'
        this.globalData.userType = this.globalData.userInfo.userType
        toResolve()
      } else {
        this.loginfail()
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  loginFail () { // 登录失败
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
  }
}

export default appConfig
