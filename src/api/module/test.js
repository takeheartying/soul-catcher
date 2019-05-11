import wxRequest from '../wxRequest.js'

// 获取测试列表
export const getTestList = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
// 获取测试详情
export const getTestDetailInfoById = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
