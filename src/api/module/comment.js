import wxRequest from '../wxRequest.js'

// 提交评论
export const submitComment = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
