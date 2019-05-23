const addConsult = async (params) => {
  let promise = await wx.cloud.callFunction({
    // 云函数名称
    name: 'consult',
    // 传给云函数的参数
    data: Object.assign({$url: 'consult/add'}, params)
  }).then(res => {
    // debugger
    if (res && res.result && res.result._id) {
      return res.result
    }
  }).catch(err => {
    console.log(err)
    return err
  })
  return promise
}
export default {
  addConsult
}
