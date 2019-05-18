const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'soul-catcher-env-2f8134'
})
const dbName = 'article'
const db = cloud.database()

// 知识库列表：
const getKnowledgeBaseList = async (event) => {
  let filter = {}
  let orderBy = {}
  if (event.searchType === 'newTime') { // 按照时间顺序
    orderBy = {
      fieldName: 'createTime',
      order: 'desc'
    }
  }
  if (event.searchType === 'mostComment') { // 按照评论数最多
    orderBy = {
      fieldName: 'commentNum',
      order: 'desc'
    }
  }
  if (event.tagType) { // 按照标签类型
    filter.tagType = event.tagType
  }
  if (event.expertId) {
    filter.author = {
      _id: event.expertId
    }
  }
  let promise = await cloud.callFunction({
    name: 'paginator',
    data: {
      dbName: 'article',
      pageNo: event.pageNo,
      pageSize: event.pageSize,
      orderBy: orderBy,
      filter: filter
    }
  }).then(res => {
    console.log(res)
    if (res && res.result) {
      return res.result
    }
  }).catch(err => {
    return err
  })
  return promise
}

// 知识库详情：
const getKnowledgeDetailById = async (event) => {
  let promise = await db.collection(dbName).doc(event._id).get().then(res => {
    return res
  })
  return promise
}
// 知识库修改：[先上传图片再修改数据库]
const updateKnowledge = async (event) => {
  let promise = {}
  if (event.uploadParams) {
    promise = await cloud.callFunction({
      name: 'upload',
      data: Object.assign({$url: 'upload/add'}, event)
    }).then(res => {
      console.log('上传图片结果-----', res)
      if (res && res.result) {
        return res.result.fileID
      }
    }).then(fileID => {
      console.log('fileID:', fileID)
      if (fileID) {
        event.picUrl = fileID
        db.collection(dbName).doc(event._id).update({
          data: event
        }).then(res => {
          return res
        }).catch(err => {
          return err
        })
      }
    }).catch(err => {
      return err
    })
  }
  return promise
}
module.exports = {
  getKnowledgeBaseList,
  getKnowledgeDetailById,
  updateKnowledge
}
