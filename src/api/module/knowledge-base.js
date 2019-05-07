// 知识库： 文章 视频
import wxRequest from '../wxRequest.js'

// 获取文章：
export const getArticle = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
