const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'soul-catcher-env-2f8134'
})
const dbName = 'article'
const db = cloud.database()

const filterTagType = function (event) {
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
  return event
}

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
  event = filterTagType(event)
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
      res.result.picUrl = event.picUrl // 返回给前端
    }
    return res
  }).catch(err => {
    return err
  })
  return promise
}
// 知识库添加：[先上传图片再修改数据库]
const addKnowledge = async (event) => {
  event = filterTagType(event)
  // 获取作者信息：
  let promise = await db.collection('user').doc(event.userId).get().then(async res => {
    let result = {
      message: '提交中！'
    }
    if (res && res.data && res.data.length) {
      await db.collection(dbName).add({
        data: {
          author: res.data[0],
          createTime: new Date(),
          content: event.content,
          desc: event.desc,
          picUrl: event.picUrl,
          tagType: event.tagType,
          title: event.title,
          tagTypeDesc: event.tagTypeDesc,
          commentNum: 0
        }
      }).then(res => {
        result = res
        console.log('新增知识库成功！')
        return res
      })
    } else {
      result = {
        message: '添加失败！',
        code: '-1',
        flag: '-1'
      }
    }
    return result
  })
  return promise
}
module.exports = {
  filterTagType,
  getKnowledgeBaseList,
  getKnowledgeDetailById,
  updateKnowledge,
  addKnowledge
}
