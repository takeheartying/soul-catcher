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
  if (params.uploadParams) { // 有图片需要上传
    // 上传入参： filePath [图片临时路径]
    params.filePath = params.uploadParams.filePath
    debugger
    await upload.uploadFile(params, () => {
      if (params.fileID) {
        params.picUrl = params.fileID
        wx.cloud.callFunction({
          name: 'knowledge-base',
          data: Object.assign({$url: 'knowledge/update'}, params)
        }).then(res => {
          if (res && res.result && res.result.stats) {
            console.log('提交成功！')
            return res.result
          }
          debugger
        }).catch(err => {
          console.log('提交失败！')
          return err
        })
      }
    })
  } else {
    // 普通知识库修改：
    return wx.cloud.callFunction({
      name: 'knowledge-base',
      data: Object.assign({$url: 'knowledge/update'}, params)
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
}

export default {
  getKnowledgeList,
  getKnowledgeDetailById,
  updateKnowledge
}
