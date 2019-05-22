const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'soul-catcher-env-2f8134'
})
const dbName = 'fan-concerner'
const db = cloud.database()
const _ = db.command

// 我的粉丝列表：
const getFanstList = async (event) => {
  let filter = {}
  let orderBy = {}
  if (event.searchType === 'newTime') { // 按照时间顺序
    orderBy = {
      fieldName: 'createTime',
      order: 'desc'
    }
  }
  let promise = await cloud.callFunction({
    name: 'paginator',
    data: {
      dbName: 'user',
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

// 取消关注
const deleteConcern = async (event) => {
  let promise = await db.collection(dbName).where({
    fanId: event.fanId,
    beConcernedUserId: event.beConcernedUserId
  }).remove().then(async res => {
    let result = {
      message: '删除中！'
    }
    if (res && res.stats && res.stats.removed) { // 删除成功！
      result = {
        code: '0',
        flag: '0',
        message: '取消成功',
        removed: res.stats.removed
      }
    } else {
      result = {
        code: '-1',
        flag: '-1',
        hasConcern: true,
        message: '取消关注失败'
      }
    }
    return result
  }).then(async result => {
    if (result.code === '1') {
      await db.collection('user').doc(event.beConcernedUserId).update({
        data: {
          fanNum: _.inc(-result.removed) // 粉丝数减少1
        }
      }).then(res => {
        if (res && res.stats && res.stats.updated) {
          result = {
            code: '0',
            flag: '0',
            message: '删除成功',
            hasConcern: false
          }
        }
        return res
      }).catch(err => {
        console.log(err)
      })
    }
    return result
  }).catch(err => {
    console.log(err)
    return {
      code: '-1',
      flag: '-1',
      message: err.errMsg || err.message || '系统错误'
    }
  })
  return promise
}
// 增加关注 1.数据库增加记录 2.user数据库的fanNum+1
const addConcern = async (event) => {
  let promise = await db.collection(dbName).add({
    data: {
      fanId: event.fanId,
      beConcernedUserId: event.beConcernedUserId
    }
  }).then(async res => {
    let result = {
      message: '添加中！'
    }
    if (res && res._id) { // 添加成功
      await db.collection('user').doc(event.beConcernedUserId).update({
        data: {
          fanNum: _.inc(1) // 粉丝数添加一
        }
      }).then(res => {
        if (res && res.stats && res.stats.updated) {
          result = {
            code: '0',
            flag: '0',
            message: '添加成功',
            hasConcern: true
          }
        }
        return res
      }).catch(err => {
        console.log(err)
        result = {
          code: '-1',
          flag: '-1',
          message: '关注失败',
          hasConcern: false
        }
      })
    } else {
      result = {
        message: '关注失败！',
        code: '-1',
        flag: '-1',
        hasConcern: false
      }
    }
    return result
  })
  return promise
}
// 获取关注信息：
const getConcernInfo = async (event) => {
  let countRes = await db.collection(dbName).where({
    fanId: event.fanId,
    beConcernedUserId: event.beConcernedUserId
  }).count
  let countNum = countRes.total || 0
  if (countNum > 0) {
    return {
      hasConcern: true
    }
  } else {
    return {
      hasConcern: false
    }
  }
}
module.exports = {
  getConcernInfo,
  getFanstList,
  deleteConcern,
  addConcern
}
