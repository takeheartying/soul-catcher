import wxRequest from '../wxRequest.js'

// 获取咨询列表
export const submitComment = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}