import wxRequest from '../wxRequest.js'
import myRequest from '../myRequest.js'
import consult from '../controller/consult.js'
export const addConsult = (params) => {
  return consult.addConsult(params).then(res => {
    res = myRequest.checkRequest(res)
    return res || {}
  })
}
// 获取咨询列表
export const getConsultList = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
// 新增咨询室
// export const addConsult = (params) => {
//   return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
//     return res || {}
//   })
// }
