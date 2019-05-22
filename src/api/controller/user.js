// import moment from 'moment'
const getUserInfo = (params) => {
  return wx.cloud.callFunction({
    name: 'user',
    data: Object.assign({$url: 'user/detail'}, params)
  }).then(res => {
    if (res && res.errCode) {
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
const updateUserInfo = (params) => {
  return wx.cloud.callFunction({
    name: 'user',
    data: Object.assign({$url: 'user/update'}, params)
  }).then(res => {
    if (res && res.errCode) {
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
const initLogin = (params) => { // 获取openId
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
const getUserList = (params) => {
  return wx.cloud.callFunction({
    // 云函数名称
    name: 'user',
    // 传给云函数的参数
    data: Object.assign({$url: 'user/list'}, params)
  }).then(res => {
    debugger
    // 调用云函数的分页方法：
    if (res && res.result && res.result.data) {
      if (res && res.result && res.result.data) {
        let _result = res.result
        if (_result.data.data && params.tagType) { // 按照类型筛选专家
          let newArr = _result.data.filter(user => {
            if (user.tagList.indexOf(params.tagType) > -1) {
              return user
            }
          })
          debugger
          res.result.data = newArr
        }
        return {
          flag: '0',
          code: '0',
          message: '查询成功！',
          data: res.result
        }
      }
    } else {
      return {
        flag: '-1',
        code: '-1',
        errCode: res.result.errCode,
        message: res.result.errMsg || '未搜索到用户列表！'
      }
    }
  }).catch(err => {
    console.log(err)
    return {
      message: '系统错误',
      code: '-1',
      flag: '-1'
    }
  })
}
export default {
  getUserList,
  updateUserInfo,
  getUserInfo,
  register,
  login,
  initLogin
}
