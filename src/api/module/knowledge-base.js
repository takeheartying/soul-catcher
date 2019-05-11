// 知识库： 文章 视频
import wxRequest from '../wxRequest.js'

// 获取知识库列表
export const getKnowledgeList = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}

// 获取知识库详情
export const getKnowledgeDetailById = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
