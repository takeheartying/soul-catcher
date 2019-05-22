const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'soul-catcher-env-2f8134'
})
const dbName = 'test-result'
const db = cloud.database()
const _ = db.command

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

// 测试题结果列表：
const getTestResultList = async (event) => {
  let filter = {}
  let orderBy = {}
  if (event.searchType === 'newTime') { // 按照时间顺序
    orderBy = {
      fieldName: 'createTime',
      order: 'desc'
    }
  }
  if (event.tagType) { // 按照标签类型
    filter.tagType = event.tagType
  }
  let promise = await cloud.callFunction({
    name: 'paginator',
    data: {
      dbName: 'test-result',
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

// 测试题结果详情：
const getTestResultDetailById = async (event) => {
  let promise = await db.collection(dbName).doc(event._id).get().then(res => {
    return res
  })
  return promise
}
// 测试题结果添加：
const addTestResult = async (event) => {
  // 1.获取测试者信息：
  let promise = await db.collection('user').doc(event.userId).get().then(res => {
    if (res && res.data) {
      if (res.data.userType !== '1') {
        return {
          code: '-1',
          flag: '-1',
          message: '只能学生进行测试！'
        }
      } else {
        return {
          user: res.data
        }
      }
    } else {
      return {
        message: '没有用户信息',
        code: '-1',
        flag: '-1'
      }
    }
  }).then(async res => {
    // 2.查询测试题信息：
    if (res && res.user) {
      await db.collection('test').doc(event.testId).get().then(_res => {
        if (_res && _res.data) {
          res.test = _res.data
        } else {
          res = {
            message: '没有测试题信息',
            code: '-1',
            flag: '-1'
          }
        }
      })
    }
    return res
  }).then(async res => {
    // 3.添加到数据库test-result
    if (res && res.user && res.test) {
      await db.collection(dbName).add({
        data: {
          user: res.user,
          createTime: new Date(),
          resultScore: event.resultScore,
          examList: event.examList,
          test: res.test,
          testId: res.test._id,
          userId: res.user._id
        }
      }).then(_res => {
        if (_res && _res._id) {
          res = {
            user: res.user,
            test: res.test,
            data: {
              resultScore: event.resultScore,
              avatarUrl: res.user.avatarUrl,
              _id: _res._id
            },
            message: '新增测试成功！'
          }
          console.log('新增测试题结果成功！')
        } else {
          res = {
            code: '-1',
            flag: '-1',
            message: res.message || '提交失败'
          }
        }
      }).catch(err => {
        res = err
      })
    }
    return res
  }).then(async res => {
    // 4.修改test数据库的测试人数 testorNum
    if (res && res.data) {
      // 曾经判断是否曾经测试过：
      let everTestNumRes = await db.collection('test-result').where({
        testId: res.test._id,
        userId: res.user._id
      }).count()
      let everTestNum = everTestNumRes.total
      if (everTestNum === 1) { // 只是现在测试了一次
        await db.collection('test').doc(res.test._id).update({
          data: {
            testorNum: _.inc(1)
          }
        }).then(_res => {
          if (_res && _res.stats) {
            res = {
              code: '0',
              flag: '0',
              data: res.data,
              message: '新增测试成功且人数已修改'
            }
          } else {
            res = {
              code: '-1',
              flag: '-1',
              data: res.data,
              message: '新增测试成功且人数已修改'
            }
          }
        }).catch(err => {
          console.log(err)
          res = Object.assign(err, res)
        })
      } else {
        res = {
          code: '0',
          flag: '0',
          data: res.data,
          message: '新增测试成功'
        }
      }
    }
    return res
  })
  return promise
}
module.exports = {
  filterTagType,
  getTestResultList,
  getTestResultDetailById,
  addTestResult
}
