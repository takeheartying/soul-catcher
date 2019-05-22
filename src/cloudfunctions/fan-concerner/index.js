// 腾讯的云函数路由：
const TcbRouter = require('tcb-router')
// 所有的关注api:
const fanConcerner = require('./fanConcerner.js')

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
  // 查看我的粉丝【我的关注】：
  app.router('fan-concerner/list', async (ctx, next) => {
    delete event.$url
    let promise = await fanConcerner.getFanstList(event)
    ctx.body = promise
  })
  // 取消关注：
  app.router('fan-concerner/delete', async (ctx, next) => {
    delete event.$url
    let promise = await fanConcerner.deleteConcern(event)
    ctx.body = promise
  })
  // 增加关注：
  app.router('fan-concerner/add', async (ctx, next) => {
    delete event.$url
    let promise = await fanConcerner.addConcern(event)
    ctx.body = promise
  })
  // 查看是否关注：
  app.router('fan-concerner/detail', async (ctx, next) => {
    delete event.$url
    let promise = await fanConcerner.getConcernInfo(event)
    ctx.body = promise
  })
  return app.serve()
}
