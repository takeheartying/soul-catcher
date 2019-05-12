import wxRequest from '../wxRequest.js'

// 获取单次咨询的 用户被评分信息
export const getConsultScoreInfo = (params) => {
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
