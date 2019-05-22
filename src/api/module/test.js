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
  return test.getTestDetailById(params).then(res => {
    res = myRequest.checkRequest(res)
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
// 以下都是测试结果的api

// 根据学生id获取测试结果列表 -- 只有学生有测试结果列表
export const getTestResultList = (params) => {
  return test.getTestResultList(params).then(res => {
    res = myRequest.checkRequest(res)
    return res || {}
  })
}
// 提交测试结果
export const submitTestResult = (params) => {
  return test.submitTestResult(params).then(res => {
    res = myRequest.checkRequest(res)
    return res || {}
  })
}
// 获取测试结果的详情信息
export const getTestResultDetailById = (params) => {
  return test.getTestResultDetailById(params).then(res => {
    res = myRequest.checkRequest(res)
    return res || {}
  })
}
