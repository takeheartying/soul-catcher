import moment from 'moment'
import upload from './upload.js'
const getKnowledgeList = (params) => {
  return wx.cloud.callFunction({
    // 云函数名称
    name: 'knowledge-base',
    // 传给云函数的参数
    data: Object.assign({$url: 'knowledge/list'}, params)
  }).then(res => {
    // 调用云函数的分页方法：
    if (res && res.result && res.result.data) {
      if (res && res.result && res.result.data) {
        return res.result
      }
    }
  }).catch(err => {
    return err
  })
}
const getKnowledgeDetailById = (params) => {
  return wx.cloud.callFunction({
    name: 'knowledge-base',
    data: Object.assign({$url: 'knowledge/detail'}, params)
  }).then(res => {
    if (res && res.result && res.result.data) {
      if (res && res.result && res.result.data) {
        res.result.data.createTime = moment(res.result.data.createTime).format('YYYY-MM-DD')
        return res.result
      }
    }
  }).catch(err => {
    return err
  })
}
const updateKnowledge = async (params) => {
  if (params.uploadParams && params.uploadParams.filePath) { // 有图片需要上传
    // 上传入参： filePath [图片临时路径]
    params.filePath = params.uploadParams.filePath
    let promise = await upload.uploadFile(params).then(async (params) => {
      console.log(params.message)
      let _res = {}
      if (params.fileID) {
        params.picUrl = params.fileID
        await wx.cloud.callFunction({
          name: 'knowledge-base',
          data: Object.assign({$url: 'knowledge/update'}, params)
        }).then(res => {
          if (res && res.result && res.result.stats) {
            _res = Object.assign(res.result, {
              picUrl: params.picUrl,
              message: '提交成功！',
              code: '0'
            })
            return res.result
          } else {
            _res = {
              message: '提交失败！',
              code: '-1'
            }
          }
        }).catch(err => {
          console.log('提交失败！', err)
          _res = {
            message: '系统出错！',
            code: '-1'
          }
          return err
        })
      }
      return _res
    })
    return promise
  } else {
    // 普通知识库修改：
    return wx.cloud.callFunction({
      name: 'knowledge-base',
      data: Object.assign({$url: 'knowledge/update'}, params)
    }).then(res => {
      if (res && res.result && res.result.stats && res.result.stats) {
        return {
          message: '提交成功',
          code: '0'
        }
      } else {
        return {
          message: '提交失败！',
          code: '-1'
        }
      }
    }).catch(err => {
      console.log(err)
      return {
        message: '系统出错！',
        code: '-1'
      }
    })
  }
}

const addKnowledge = async (params) => {
  if (params.uploadParams && params.uploadParams.filePath) { // 有图片需要上传
    // 上传入参： filePath [图片临时路径]
    params.filePath = params.uploadParams.filePath
    let promise = await upload.uploadFile(params).then(async (params) => {
      console.log(params.message)
      let _res = {}
      if (params.fileID) {
        params.picUrl = params.fileID
        await wx.cloud.callFunction({
          name: 'knowledge-base',
          data: Object.assign({$url: 'knowledge/add'}, params)
        }).then(res => {
          if (res && res.result && res.result._id) {
            _res = Object.assign(res.result, {
              picUrl: params.picUrl,
              message: '添加成功！',
              code: '0'
            })
            return res.result
          } else {
            _res = {
              message: '添加失败！',
              code: '-1'
            }
          }
        }).catch(err => {
          console.log('添加失败！', err)
          _res = {
            message: '系统出错！',
            code: '-1'
          }
          return err
        })
      }
      return _res
    })
    return promise
  } else {
    // 普通知识库修改：
    return wx.cloud.callFunction({
      name: 'knowledge-base',
      data: Object.assign({$url: 'knowledge/update'}, params)
    }).then(res => {
      if (res && res.result && res.result.stats && res.result.stats) {
        return {
          message: '提交成功',
          code: '0'
        }
      } else {
        return {
          message: '提交失败！',
          code: '-1'
        }
      }
    }).catch(err => {
      console.log(err)
      return {
        message: '系统出错！',
        code: '-1'
      }
    })
  }
}
export default {
  getKnowledgeList,
  getKnowledgeDetailById,
  updateKnowledge,
  addKnowledge
}
