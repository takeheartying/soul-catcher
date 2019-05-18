const getKnowledgeList = (params) => {
  return wx.cloud.callFunction({
    // 云函数名称
    name: 'knowledge-base',
    // 传给云函数的参数
    data: params
  }).then(res => {
    // 调用云函数的分页方法：
    if (res && res.result && res.result.data) {
      return res.result
    }
  }).catch(err => {
    return err
  })
}
export default {
  getKnowledgeList
}
