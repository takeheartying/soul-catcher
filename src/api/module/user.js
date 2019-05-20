import wxRequest from '../wxRequest.js'
import myRequest from '../myRequest.js'
// 知识库： 文章
import user from '../controller/user.js'
// 初始登录--获取opId
export const initLogin = (params) => {
  return user.initLogin(params).then(res => {
    res = myRequest.checkRequest(res)
    return res || {}
  })
}
// 登录
export const login = (params) => {
  return user.login(params).then(res => {
    res = myRequest.checkRequest(res)
    return res || {}
  })
}
// 注册【增加用户】
export const register = (params) => {
  return user.register(params).then(res => {
    res = myRequest.checkRequest(res)
    return res || {}
  })
}
// 获取用户信息
export const getUserInfo = (params) => {
  return user.getUserInfo(params).then(res => {
    res = myRequest.checkRequest(res)
    return res || {}
  })
}
// 修改个人信息：
export const updateUserInfo = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
// 根据学生id获取记录 【score：4代表小于等于4的预警记录】
export const getRecordListByUserId = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
