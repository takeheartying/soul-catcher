// 知识库： 文章 视频
import knowledgeBase from '../controller/knowledge-base'

// 获取知识库列表
export const getKnowledgeList = (params) => {
  return knowledgeBase.getKnowledgeList(params).then(res => {
    return res || {}
  })
}
// 获取知识库详情
export const getKnowledgeDetailById = (params) => {
  return knowledgeBase.getKnowledgeDetailById(params).then(res => {
    return res || {}
  })
}
// 添加知识库
export const addKnowledge = (params) => {
  return knowledgeBase.addKnowledge(params).then(res => {
    return res || {}
  })
}
// 修改知识库
export const updateKnowledge = (params) => {
  return knowledgeBase.updateKnowledge(params).then(res => {
    return res || {}
  })
}
