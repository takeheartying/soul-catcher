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
  if (event.tagType) {
    switch (event.tagType) {
      case '1':
        event.tagTypeDesc = '爱情脱单'
        break
      case '2':
        event.tagTypeDesc = '智商情商'
        break
      case '3':
        event.tagTypeDesc = '趣味性格'
        break
      case '4':
        event.tagTypeDesc = '心理综合'
        break
      default: break
    }
  }
  let promise = await db.collection(dbName).doc(event._id).update({
    data: {
      content: event.content,
      desc: event.desc,
      picUrl: event.picUrl,
      tagType: event.tagType,
      title: event.title,
      tagTypeDesc: event.tagTypeDesc
    }
  }).then(res => {
    console.log('提交知识库修改成功！')
    if (res && res.result) {
      // 删除旧的图片：
    }
    return res
  }).catch(err => {
    return err
  })
  return promise
}
module.exports = {
  getKnowledgeBaseList,
  getKnowledgeDetailById,
  updateKnowledge
}
