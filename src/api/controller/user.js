// import moment from 'moment'
const getUserInfo = (params) => {
  return wx.cloud.callFunction({
    name: 'user',
    data: Object.assign({$url: 'user/detail'}, params)
  }).then(res => {
    if (res && res.errcode) {
      return {
        flag: '-1',
        code: res.errCode,
        message: res.errMsg || '系统错误'
      }
    }
    if (res && res.result) {
      return res.result
    }
  }).catch(err => {
    return err
  })
}
const register = (params) => {
  return wx.cloud.callFunction({
    name: 'user',
    data: Object.assign({$url: 'user/register'}, params)
  }).then(res => {
    if (res && res.result) {
      return res.result
    }
  }).catch(err => {
    return err
  })
}
const login = (params) => {
  return wx.cloud.callFunction({
    name: 'user',
    data: Object.assign({$url: 'user/login'}, params)
  }).then(res => {
    if (res && res.result) {
      return res.result
    }
  }).catch(err => {
    return err
  })
}
const initLogin = (params) => { // 获取opId
  return wx.cloud.callFunction({
    name: 'user',
    data: Object.assign({$url: 'user/initLogin'}, params)
  }).then(res => {
    if (res && res.result) {
      return res.result
    }
  }).catch(err => {
    return err
  })
}
export default {
  getUserInfo,
  register,
  login,
  initLogin
}
