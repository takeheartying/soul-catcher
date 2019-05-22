// 腾讯的云函数路由：
const TcbRouter = require('tcb-router')
// 所有的测试结果api:
const test = require('./test-result.js')

// 按请求给云函数归类: 将相似的请求归类到同一个云函数处理
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'soul-catcher-env-2f8134'
})
exports.main = (event, context) => {
  console.log('event', event)
  if (!(event.userInfo && event.userInfo.openId) && !cloud.getWXContext().OPENID) {
    return {
      code: '-1',
      flag: '-1',
      loginState: 'noLogin',
      message: '用户未授权登录小程序'
    }
  }
  const app = new TcbRouter({ event })
  app.router('test-result/list', async (ctx, next) => {
    delete event.$url
    let promise = await test.getTestResultList(event)
    ctx.body = promise
  })
  app.router('test-result/detail', async (ctx, next) => {
    delete event.$url
    let promise = await test.getTestResultDetailById(event)
    ctx.body = promise
  })
  app.router('test-result/add', async (ctx, next) => {
    delete event.$url
    let promise = await test.addTestResult(event)
    ctx.body = promise
  })
  return app.serve()
}
