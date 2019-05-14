import wxRequest from '../wxRequest.js'

// 登录
export const login = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
// 设置角色：
export const updateUserType = (params) => {
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
// 根据学生id获取记录 【score：4代表小于等于4的预警记录】
export const getRecordListByUserId = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
