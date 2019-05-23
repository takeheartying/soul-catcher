// 腾讯的云函数路由：
const TcbRouter = require('tcb-router')
// 所有的咨询api:
const consult = require('./consult.js')

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
  app.router('consult/list', async (ctx, next) => {
    delete event.$url
    let promise = await consult.getTestList(event)
    ctx.body = promise
  })
  app.router('consult/detail', async (ctx, next) => {
    delete event.$url
    let promise = await consult.getTestDetailById(event)
    ctx.body = promise
  })
  app.router('consult/update', async (ctx, next) => {
    delete event.$url
    let promise = await consult.updateTest(event)
    ctx.body = promise
  })
  app.router('consult/add', async (ctx, next) => {
    delete event.$url
    let promise = await consult.addTest(event)
    ctx.body = promise
  })
  return app.serve()
}
