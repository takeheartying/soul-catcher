import wxRequest from '../wxRequest.js'

// 获取评分信息
export const getScoreInfo = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
// 提交评分
export const submitScore = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
