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
  // 获取三个id：
  // 若parentId入参，查询studentId,
  // 若studentId入参，查询parentId
  if (event.studentId) {
    await db.collection('user').where({ // 只有家长目前有relationShipId
      relationShipId: event.studentId
    }).get().then(res => {
      if (res && res.data && res.data.length) {
        event.parentId = res.data[0]._id
      } else {
        event.parentId = ''
      }
    })
  } else if (event.parentId) {
    event.studentId = await db.collection('user').doc(event.parentId).relationShipId || ''
  }
  // 查询是否已经有了正在进行的咨询：
  let promise = await db.collection(dbName).where({
    parentId: event.parentId,
    studentId: event.studentId,
    expertId: event.expertId,
    consultStatus: 2
  }).get().then(res => {
    if (res && res.data && res.data.length) {
      return {
        _id: res.data._id,
        message: '已经存在咨询了！'
      }
    } else {
      return res
    }
  }).then(async res => {
    if (res && res._id) {
      return res
    } else {
      let result
      await db.collection(dbName).add({
        data: {
          createTime: new Date(),
          parentId: event.parentId,
          studentId: event.studentId,
          expertId: event.expertId,
          consultStatus: 2,
          consultStatusDesc: '进行中'
        }
      }).then(res => {
        result = res
        if (res && res._id) {
          setTimeout(() => { // 十分钟之后状态变化为 已关闭3
            db.collection(dbName).where({
              _id: res._id
            }).update({
              data: {
                consultStatus: 3,
                consultStatusDesc: '已关闭'
              }
            }).then(_res => {
              if (_res && _res.stats && _res.stats.updated) {
                console.log('已关闭id=')
              } else {
                console.log('未关闭咨询室')
              }
            })
          }, 10 * 60 * 1000)
          result = {
            code: '0',
            flag: '0',
            message: '添加成功!',
            _id: res._id
          }
        } else {
          result = {
            code: '-1',
            flag: '-1',
            message: '添加失败！'
          }
        }
      })
      return result
    }
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
