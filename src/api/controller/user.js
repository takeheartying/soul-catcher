// import moment from 'moment'
const getUserInfo = (params) => {
  return wx.cloud.callFunction({
    name: 'user',
    data: Object.assign({$url: 'user/detail'}, params)
  }).then(res => {
    if (res && res.errCode) {
      return {
        flag: '-1',
        code: res.errCode,
        message: res.errMsg || '系统错误'
      }
    }
    if (res && res.result) {
      return res.result
    }
  }).catch(err => {
    return err
  })
}
const updateUserInfo = (params) => {
  return wx.cloud.callFunction({
    name: 'user',
    data: Object.assign({$url: 'user/update'}, params)
  }).then(res => {
    if (res && res.errCode) {
      return {
        flag: '-1',
        code: res.errCode,
        message: res.errMsg || '系统错误'
      }
    }
    if (res && res.result) {
      return res.result
    }
  }).catch(err => {
    return err
  })
}
const register = (params) => {
  return wx.cloud.callFunction({
    name: 'user',
    data: Object.assign({$url: 'user/register'}, params)
  }).then(res => {
    if (res && res.result) {
      return res.result
    }
  }).catch(err => {
    return err
  })
}
const login = (params) => {
  return wx.cloud.callFunction({
    name: 'user',
    data: Object.assign({$url: 'user/login'}, params)
  }).then(res => {
    if (res && res.result) {
      return res.result
    }
  }).catch(err => {
    return err
  })
}
const initLogin = (params) => { // 获取openId
  return wx.cloud.callFunction({
    name: 'user',
    data: Object.assign({$url: 'user/initLogin'}, params)
  }).then(res => {
    if (res && res.result) {
      return res.result
    }
  }).catch(err => {
    return err
  })
}
const getUserList = (params) => {
  return wx.cloud.callFunction({
    // 云函数名称
    name: 'user',
    // 传给云函数的参数
    data: Object.assign({$url: 'user/list'}, params)
  }).then(res => {
    // 调用云函数的分页方法：
    if (res && res.result && res.result.data) {
      if (res && res.result && res.result.data) {
        let _result = res.result
        if (_result.data && params.tagType) { // 按照类型筛选专家
          let newArr = _result.data.filter(user => {
            if (user.tagList.indexOf(params.tagType) > -1) {
              return user
            }
          })
          res.result.data = newArr
        }
        return {
          flag: '0',
          code: '0',
          message: '查询成功！',
          data: res.result
        }
      }
    } else {
      return {
        flag: '-1',
        code: '-1',
        errCode: res.result.errCode,
        message: res.result.errMsg || '未搜索到用户列表！'
      }
    }
  }).catch(err => {
    console.log(err)
    return {
      message: '系统错误',
      code: '-1',
      flag: '-1'
    }
  })
}
const getExpertInfo = (params) => {
  return wx.cloud.callFunction({ // 获取专家基本信息
    name: 'user',
    data: Object.assign({$url: 'user/detail'}, params)
  }).then(res => {
    if (res && res.errCode) {
      return {
        flag: '-1',
        code: res.errCode,
        message: res.errMsg || '系统错误'
      }
    }
    if (res && res.result) {
      return res.result
    }
  }).then(async res => {
    if (res && res.data) {
      if (!res.data.averageScore) {
        res.data.averageScore = 0
      }
      if (!res.data.fanNum) {
        res.data.fanNum = 0
      }
      await wx.cloud.callFunction({
        name: 'knowledge-base',
        data: Object.assign({$url: 'knowledge/list'}, {
          expertId: params.userId,
          searchType: 'newTime',
          pageNo: 1,
          pageSize: 20
        })
      }).then(_res => {
        console.log(_res)
        // 调用云函数的分页方法：
        if (_res && _res.result && _res.result.data) {
          if (_res && _res.result && _res.result.data) {
            res.data.knowledgeList = _res.result.data
            res.data.knowledgeNum = _res.result.totalCount
            return _res.result
          }
        }
      }).catch(err => {
        console.log(err)
        return err
      })
    }
    return res
  }).then(async res => { // 查看是否有关注该专家
    if (res && res.data) {
      await wx.cloud.callFunction({
        name: 'fan-concerner',
        data: Object.assign({$url: 'fan-concerner/detail'}, {
          fanId: params.fanId,
          beConcernedUserId: params.userId
        })
      }).then(_res => {
        console.log(_res)
        if (_res && _res.result) {
          res.data.hasConcern = _res.result.hasConcern
        }
      }).catch(err => {
        console.log(err)
      })
    }
    return res
  }).catch(err => {
    return err
  })
}
// 关注与取消关注
const concernUser = async (params) => {
  let promise = {}
  if (params.hasConcern) { // 添加关注
    promise = await wx.cloud.callFunction({
      name: 'fan-concerner',
      data: Object.assign({$url: 'fan-concerner/add'}, {
        fanId: params.fanId,
        beConcernedUserId: params.beConcernedUserId
      })
    }).then(_res => {
      console.log(_res)
      if (_res && _res.result) {
        return {
          code: '0',
          flag: '0',
          message: '成功关注！',
          hasConcern: _res.result.hasConcern
        }
      }
    }).catch(err => {
      console.log(err)
    })
  } else { // 取消关注
    promise = await wx.cloud.callFunction({
      name: 'fan-concerner',
      data: Object.assign({$url: 'fan-concerner/delete'}, {
        fanId: params.fanId,
        beConcernedUserId: params.beConcernedUserId
      })
    }).then(_res => {
      console.log(_res)
      if (_res && _res.result) {
        return {
          code: '0',
          flag: '0',
          message: '成功取消关注！',
          hasConcern: _res.result.hasConcern
        }
      }
    }).catch(err => {
      console.log(err)
    })
  }
  return promise
}
export default {
  concernUser,
  getExpertInfo,
  getUserList,
  updateUserInfo,
  getUserInfo,
  register,
  login,
  initLogin
}
