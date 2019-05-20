const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'soul-catcher-env-2f8134'
})

// code: 0 系统正常， -1 系统不正常
// flag: 0 业务正常   -1   业务不正常
// loginState: 'noLogin' 未登录， 'logining' 登陆中， 'fail'登陆失败(用户拒绝)， 'done' 登陆成功 , 'temporaryLogin' 临时登录

const dbName = 'user'
const db = cloud.database()
const wxContext = cloud.getWXContext()
const updateUserInfo = async (event) => {
  if (!event.userId) {
    return {
      code: '0',
      flag: '-1',
      message: '入参无用户id'
    }
  }

  // 查询用户名是否已存在
  let promise = await db.collection(dbName).where({
    userName: event.userName
  }).get().then(res => {
    if (res && res.data && res.data.length && res.data[0]._id !== event.userId) {
      return {
        code: '0',
        flag: '-1',
        message: '用户名已存在！'
      }
    } else {
      return res
    }
  }).then(async res => {
    if (res && res.flag === '-1') {
      return res
    } else {
      event.updateTime = new Date()
      event.opId = wxContext.OPENID
      // 用户是家长： ----- 确定孩子是否注册过小程序：
      if (event.relationPhone && event.userType === '3') { // userType = 3 家长添加一个孩子的号码
        await db.collection(dbName).where({
          userType: '1',
          phone: event.relationPhone
        }).get().then(_res => {
          if (_res && _res.data && _res.data.length) {
            event.relationship = _res.data[0] // 学生已注册
          } else {
            res = {
              code: '0',
              flag: '-1',
              message: '请确认该号码所属学生已注册系统'
            }
          }
        })
        delete event.relationPhone
      }
      // 修改用户：
      let userId = event.userId
      delete event.userId
      await db.collection(dbName).doc(userId).set({
        data: event
      }).then(_res => {
        console.log('修改用户成功！')
        console.log(_res)
        res = {
          data: {
            userId: _res._id,
            name: event.name,
            userName: event.userName,
            nickName: event.nickName,
            avatarUrl: event.avatarUrl,
            userType: event.userType,
            opId: wxContext.OPENID
          },
          code: '0',
          flag: '0',
          message: '修改用户成功'
        }
        return res
      }).catch(_err => {
        res = {
          code: '0',
          flag: '-1',
          message: '修改失败！'
        }
        return _err
      })
      return res
    }
  }).catch(err => {
    return err
  })
  return promise
}
// 查询用户信息：
const getUserInfo = async (event) => {
  if (!event.userId) {
    return {
      code: '-1',
      flag: '-1',
      message: '缺少入参--userId'
    }
  }
  let promise = await db.collection(dbName).doc(event.userId).get().then(res => {
    if (res && res.data) {
      return {
        code: '0',
        flag: '0',
        message: '查找用户成功',
        data: res.data
      }
    } else {
      return {
        code: '0',
        flag: '-1',
        message: '查找用户失败'
      }
    }
  }).catch(err => {
    console.log(err)
    return {
      code: '-1',
      flag: '-1',
      message: '系统出错'
    }
  })
  return promise
}
// 用户修改：
const register = async (event) => {
  if (!event.userType) {
    return {
      code: '0',
      flag: '-1',
      message: '未选择用户角色！'
    }
  }
  // 查询用户是否已经注册：本来应该根据opId判断---为了操作多用户，这里默认统一微信用户可以多角色，判断方法： opId+userType+userName
  let promise = await db.collection(dbName).where({
    userType: event.userType,
    opId: wxContext.OPENID,
    userName: event.userName
  }).get().then(res => { // 判断是否已注册
    if (res && res.data && res.data.length) {
      return {
        code: '0',
        flag: '-1',
        message: '用户已注册，请前往登录！'
      }
    } else {
      return res
    }
  }).then(async res => {
    if (res && res.flag === '-1') {
      return res
    } else {
      event.updateTime = new Date()
      event.opId = wxContext.OPENID
      // 用户是家长： ----- 确定孩子是否注册过小程序：
      if (event.relationPhone && event.userType === '3') { // userType = 3 家长添加一个孩子的号码
        await db.collection(dbName).where({
          userType: '1',
          phone: event.relationPhone
        }).get().then(_res => {
          if (_res && _res.data && _res.data.length) {
            event.relationship = _res.data[0] // 学生已注册
          } else {
            res = {
              code: '0',
              flag: '-1',
              message: '请确认该号码所属学生已注册系统'
            }
          }
        })
        delete event.relationPhone
      }
      // 添加用户：
      await db.collection(dbName).add({
        data: event
      }).then(_res => {
        console.log('新增用户成功！')
        console.log(_res)
        res = {
          data: {
            userId: _res._id,
            name: event.name,
            userName: event.userName,
            nickName: event.nickName,
            avatarUrl: event.avatarUrl,
            userType: event.userType,
            opId: wxContext.OPENID
          },
          code: '0',
          flag: '0',
          message: '注册成功'
        }
        return res
      }).catch(_err => {
        res = {
          code: '0',
          flag: '-1',
          message: '添加失败！'
        }
        return _err
      })
      return res
    }
  }).catch(err => {
    return err
  })
  return promise
}
const login = async (event) => {
  let promise = await db.collection(dbName).where({
    opId: wxContext.OPENID,
    userName: event.userName,
    password: event.password
  }).get().then(_res => {
    if (_res && _res.data) {
      if (!_res.data.length) {
        return {
          code: '0',
          flag: '-1',
          message: '登录失败！请输入正确信息'
        }
      } else {
        let res = {
          data: {
            userName: _res.data[0].userName,
            name: _res.data[0].name,
            userId: _res.data[0]._id,
            nickName: _res.data[0].nickName,
            avatarUrl: _res.data[0].avatarUrl,
            userType: _res.data[0].userType,
            opId: wxContext.OPENID
          },
          code: '0',
          flag: '0',
          message: '登录成功'
        }
        return res
      }
    } else {
      return {
        code: '-1',
        flag: '-1',
        message: '系统错误'
      }
    }
  })
  return promise
}
const initLogin = (event) => { // 小程序端调用云函数时已经默认带上了可信的用户登录态（openid）了
  if (wxContext.OPENID) {
    return {
      code: '0',
      flag: '0',
      message: '已经临时登录了',
      data: {
        opId: wxContext.OPENID,
        avatarUrl: event.avatarUrl || '',
        nickName: event.nickName || ''
      }
    }
  }
}

module.exports = {
  updateUserInfo,
  getUserInfo,
  register,
  login,
  initLogin
}
