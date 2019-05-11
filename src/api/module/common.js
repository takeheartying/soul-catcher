import wxRequest from '../wxRequest.js'

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
// 获取首页banner信息
export const getBannerList = (params) => {
  return wxRequest.post('https://route.showapi.com/970-1', params).then(res => {
    return res || {}
  })
}
