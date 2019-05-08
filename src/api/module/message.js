import wxRequest from '../wxRequest.js'

// 获取消息列表
export const getMsgList = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
