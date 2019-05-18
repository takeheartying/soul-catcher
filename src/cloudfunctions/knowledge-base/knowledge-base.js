const getKnowledgeBaseList = async (cloud, event) => {
  // let promise = {}
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
module.exports = {
  getKnowledgeBaseList
}
