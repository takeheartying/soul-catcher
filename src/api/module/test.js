import wxRequest from '../wxRequest.js'
import myRequest from '../myRequest.js'
import test from '../controller/test.js'
// 获取测试列表
export const getTestList = (params) => {
  return test.getTestList(params).then(res => {
    res = myRequest.checkRequest(res)
    return res || {}
  })
}
// 获取测试详情
export const getTestDetailInfoById = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
// 根据学生id获取测试结果列表,没有则默认studentId是该用户
export const getTestResultListById = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
// 提交测试结果
export const submitTestResult = (params) => {
  return wxRequest.post('/common/miniprogram/login.json', params).then(res => {
    return res || {}
  })
}
// 添加测试
export const addTest = (params) => {
  return test.addTest(params).then(res => {
    res = myRequest.checkRequest(res)
    return res || {}
  })
}
// 修改测试
export const updateTest = (params) => {
  return test.updateTest(params).then(res => {
    res = myRequest.checkRequest(res)
    return res || {}
  })
}
