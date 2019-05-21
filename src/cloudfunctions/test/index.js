// 腾讯的云函数路由：
const TcbRouter = require('tcb-router')
// 所有的测试题api:
const test = require('./test.js')

// 按请求给云函数归类: 将相似的请求归类到同一个云函数处理
/*
  入参：
  {
    tagType: '1'
    searchType: 'newTime', 或 'mostComment'
    pageSize: 3,
    pageNo: 1
  }
*/
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
  app.router('test/list', async (ctx, next) => {
    delete event.$url
    let promise = await test.getTestList(event)
    ctx.body = promise
  })
  app.router('test/detail', async (ctx, next) => {
    delete event.$url
    let promise = await test.getTestDetailById(event)
    ctx.body = promise
  })
  app.router('test/update', async (ctx, next) => {
    delete event.$url
    let promise = await test.updateTest(event)
    ctx.body = promise
  })
  app.router('test/add', async (ctx, next) => {
    delete event.$url
    let promise = await test.addTest(event)
    ctx.body = promise
  })
  return app.serve()
}
