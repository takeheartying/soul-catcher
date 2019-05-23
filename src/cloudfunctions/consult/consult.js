const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'soul-catcher-env-2f8134'
})
const dbName = 'consult'
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

// 咨询列表：
const getConsultList = async (event) => {
  let filter = {}
  let orderBy = {}
  if (event.searchType === 'newTime') { // 按照时间顺序
    orderBy = {
      fieldName: 'createTime',
      order: 'desc'
    }
  }
  if (event.searchType === 'mostConsultor') { // 按照咨询人数最多
    orderBy = {
      fieldName: 'consultorNum',
      order: 'desc'
    }
  }
  let promise = await cloud.callFunction({
    name: 'paginator',
    data: {
      dbName: 'consult',
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

// 咨询题详情：
const getConsultDetailById = async (event) => {
  let promise = await db.collection(dbName).doc(event._id).get().then(res => {
    return res
  })
  return promise
}
// 咨询修改：
const updateConsult = async (event) => {
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
    console.log('提交咨询题修改成功！')
    if (res && res.stats) {
      res.picUrl = event.picUrl // 返回给前端
    }
    return res
  }).catch(err => {
    return err
  })
  return promise
}
// 咨询添加：
const addConsult = async (event) => {
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
          message: '只能管理员有权限添加咨询！'
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
          consultorNum: 0 // 咨询者人数
        }
      }).then(res => {
        result = res
        console.log('新增咨询题成功！')
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
  getConsultList,
  getConsultDetailById,
  updateConsult,
  addConsult
}
