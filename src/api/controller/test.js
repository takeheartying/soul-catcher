import moment from 'moment'
import upload from './upload.js'
const getTestList = (params) => {
  return wx.cloud.callFunction({
    // 云函数名称
    name: 'test',
    // 传给云函数的参数
    data: Object.assign({$url: 'test/list'}, params)
  }).then(res => {
    // 调用云函数的分页方法：
    if (res && res.result && res.result.data) {
      if (res && res.result && res.result.data) {
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
        message: res.result.errMsg || '未搜索到测试题列表！'
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
const getTestDetailById = (params) => {
  return wx.cloud.callFunction({
    name: 'test',
    data: Object.assign({$url: 'test/detail'}, params)
  }).then(res => {
    debugger
    if (res && res.result && res.result.data) {
      if (res && res.result && res.result.data) {
        res.result.data.createTime = moment(res.result.data.createTime).format('YYYY-MM-DD')
        return {
          code: '0',
          flag: '0',
          data: res.result.data,
          message: res.result.message || '查询成功'
        }
      }
    }
  }).catch(err => {
    return err
  })
}
const updateTest = async (params) => {
  if (params.uploadParams && params.uploadParams.filePath) { // 有图片需要上传
    // 上传入参： filePath [图片临时路径]
    params.filePath = params.uploadParams.filePath
    let promise = await upload.uploadFile(params).then(async (params) => {
      console.log('params.message:', params.message)
      let _res = {}
      if (params.fileID) {
        params.picUrl = params.fileID
        await wx.cloud.callFunction({
          name: 'test',
          data: Object.assign({$url: 'test/update'}, params)
        }).then(res => {
          if (res && res.result && res.result.stats) {
            _res = {
              message: '提交成功！',
              code: '0',
              flag: '0',
              data: Object.assign(res.result, {picUrl: params.picUrl})
            }
            return res.result
          } else {
            _res = {
              message: '提交失败！',
              code: '-1',
              flag: '-1'
            }
          }
        }).catch(err => {
          console.log('提交失败！', err)
          _res = {
            message: err.errMsg || '系统出错！',
            code: '-1',
            errCode: err.errCode,
            flag: '-1'
          }
          return err
        })
      }
      return _res
    })
    return promise
  } else {
    // 普通测试修改[不含图片上传]：
    return wx.cloud.callFunction({
      name: 'test',
      data: Object.assign({$url: 'test/update'}, params)
    }).then(res => {
      if (res && res.result && res.result.stats && res.result.stats) {
        return {
          message: '提交成功',
          code: '0',
          flag: '0'
        }
      } else {
        return {
          message: '提交失败！',
          code: '-1',
          flag: '-1'
        }
      }
    }).catch(err => {
      console.log(err)
      return {
        message: err.errMsg || '系统出错！',
        code: '-1',
        flag: '-1',
        errCode: err.errCode
      }
    })
  }
}

const addTest = async (params) => {
  if (params.uploadParams && params.uploadParams.filePath) { // 有图片需要上传
    // 上传入参： filePath [图片临时路径]
    params.filePath = params.uploadParams.filePath
    let promise = await upload.uploadFile(params).then(async (params) => {
      console.log(params.message)
      let _res = {}
      if (params.fileID) {
        params.picUrl = params.fileID
        await wx.cloud.callFunction({
          name: 'test',
          data: Object.assign({$url: 'test/add'}, params)
        }).then(res => {
          if (res && res.result) { // result={_id: 'xxx'}
            _res = {
              message: '添加成功！',
              code: '0',
              flag: '0',
              data: Object.assign(res.result, {picUrl: params.picUrl})
            }
            return res.result
          } else {
            _res = {
              message: '添加失败！',
              code: '-1',
              flag: '-1'
            }
          }
        }).catch(err => {
          console.log('添加失败！', err)
          _res = {
            message: '系统出错！',
            code: '-1',
            flag: '-1'
          }
          debugger
          return err
        })
      }
      return _res
    })
    return promise
  } else {
    return {
      code: '-1',
      flag: '-1',
      message: '没上传图片！'
    }
  }
}
export default {
  getTestList,
  getTestDetailById,
  updateTest,
  addTest
}
