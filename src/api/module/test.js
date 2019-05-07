import wxRequest from '../wxRequest.js'

// 获取测试列表
export const getTestList = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
