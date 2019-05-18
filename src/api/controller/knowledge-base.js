import moment from 'moment'
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
const updateKnowledge = (params) => {
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

export default {
  getKnowledgeList,
  getKnowledgeDetailById,
  updateKnowledge
}
