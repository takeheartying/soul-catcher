import wxRequest from '../wxRequest.js'
// 知识库： 文章
import user from '../controller/user.js'

// 登录
export const login = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
// 获取用户信息
export const getUserInfo = (params) => {
  return wxRequest.post('https://route.showapi.com/970-1', params).then(res => {
    return res || {}
  })
}
// 修改个人信息：
export const updateUserInfo = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
// 注册【增加用户】
export const register = (params) => {
  return user.register(params).then(res => {
    return res || {}
  })
}
// 根据学生id获取记录 【score：4代表小于等于4的预警记录】
export const getRecordListByUserId = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
