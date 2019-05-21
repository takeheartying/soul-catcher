const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'soul-catcher-env-2f8134'
})
const dbName = 'test'
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

// 测试题列表：
const getTestList = async (event) => {
  let filter = {}
  let orderBy = {}
  if (event.searchType === 'newTime') { // 按照时间顺序
    orderBy = {
      fieldName: 'createTime',
      order: 'desc'
    }
  }
  if (event.searchType === 'mostComment') { // 按照测试人数最多
    orderBy = {
      fieldName: 'testorNum',
      order: 'desc'
    }
  }
  if (event.tagType) { // 按照标签类型
    filter.tagType = event.tagType
  }
  let promise = await cloud.callFunction({
    name: 'paginator',
    data: {
      dbName: 'test',
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

// 测试题详情：
const getTestDetailById = async (event) => {
  let promise = await db.collection(dbName).doc(event._id).get().then(res => {
    return res
  })
  return promise
}
// 测试题修改：[先上传图片再修改数据库]
const updateTest = async (event) => {
  event = filterTagType(event)
  let promise = await db.collection(dbName).doc(event._id).update({
    data: {
      detail: event.content,
      desc: event.desc,
      picUrl: event.picUrl,
      tagType: event.tagType,
      title: event.title,
      tagTypeDesc: event.tagTypeDesc,
      examList: event.examList
    }
  }).then(res => {
    console.log('提交测试题修改成功！')
    if (res && res.stats) {
      res.picUrl = event.picUrl // 返回给前端
    }
    return res
  }).catch(err => {
    return err
  })
  return promise
}
// 测试题添加：[先上传图片再修改数据库]
const addTest = async (event) => {
  event = filterTagType(event)
  // 获取作者信息：
  let promise = await db.collection('user').doc(event.userId).get().then(async res => {
    let result = {
      message: '提交中！'
    }
    if (res && res.data) {
      if (res.data.userType !== '0') {
        return {
          code: '-1',
          flag: '-1',
          message: '只能管理员有权限添加测试！'
        }
      }
      await db.collection(dbName).add({
        data: {
          author: res.data,
          createTime: new Date(),
          detail: event.detail,
          desc: event.desc,
          picUrl: event.picUrl,
          tagType: event.tagType,
          title: event.title,
          tagTypeDesc: event.tagTypeDesc,
          examList: event.examList,
          testorNum: 0 // 测试者人数
        }
      }).then(res => {
        result = res
        console.log('新增测试题成功！')
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
  getTestList,
  getTestDetailById,
  updateTest,
  addTest
}
