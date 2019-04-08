import wxRequest from '../wxRequest.js'

// 登录
export const login = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
