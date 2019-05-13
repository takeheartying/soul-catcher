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
// 添加知识库
export const addKnowledge = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
// 修改知识库
export const updateKnowledge = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
