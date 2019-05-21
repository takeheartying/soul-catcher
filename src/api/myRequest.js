// code: 0 系统正常， -1 系统不正常
// flag: 0 业务正常   -1   业务不正常
// loginState: 'noLogin' 未登录， 'logining' 登陆中， 'fail'登陆失败(用户拒绝)， 'done' 登陆成功 , 'temporaryLogin' 临时登录
const checkRequest = function (res) {
  debugger
  if (!res) {
    return '无数据'
  }
  if (res.code && res.code === '0' && [undefined, '0'].includes(res.flag)) {
    return res
  } else if (['noLogin', 'fail'].includes(res.loginState)) { // 未登录统一逻辑
    this.$app.globalData.loginState = res.loginState
    wx.showToast({
      title: '当前账号未登录，请登录',
      icon: 'none',
      duration: 1000
    })
    setTimeout(_ => {
      wx.navigateTo({ url: '/pages/middle-login/main' })
    }, 1000)
    return res.message || ''
  } else {
    if (res.errCode === -501002) {
      res.message = '云端响应超时'
    }
    if (res.errCode === -501001) {
      res.message = '云端系统错误'
    }
    setTimeout(() => {
      wx.showToast({
        title: res.errMsg || res.message,
        icon: 'none',
        duration: 2000
      })
    }, 50)
    return {
      message: res.errMsg || res.message,
      flag: '-1',
      code: '-1',
      errCode: res.errCode || '-1'
    }
  }
}
export default {
  checkRequest
}
