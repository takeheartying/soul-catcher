const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'soul-catcher-env-2f8134'
})
// 腾讯的云函数路由：
const TcbRouter = require('tcb-router')
// 所有的用户api:
const user = require('./user.js')

// 按请求给云函数归类: 将相似的请求归类到同一个云函数处理
/*
  入参：
  {
    tagType: '1'
    userType: 'article',
    searchType: 'newTime', 或 'mostComment'
    pageSize: 3,
    pageNo: 1
  }
*/
const wxContext = cloud.getWXContext()
exports.main = (event, context) => {
  console.log('event', event)
  const app = new TcbRouter({ event })
  app.router('user/register', async (ctx, next) => {
    if (!wxContext.OPENID) {
      return {
        code: '0',
        flag: '-1',
        message: '用户未授权登录小程序'
      }
    }
    delete event.$url
    let promise = await user.register(event)
    ctx.body = promise
  })
  app.router('user/login', async (ctx, next) => {
    if (!wxContext.OPENID) {
      return {
        code: '0',
        flag: '-1',
        message: '用户未授权登录小程序'
      }
    }
    delete event.$url
    let promise = await user.login(event)
    ctx.body = promise
  })
  app.router('user/detail', async (ctx, next) => {
    if (!wxContext.OPENID) {
      return {
        code: '0',
        flag: '-1',
        message: '用户未授权登录小程序'
      }
    }
    delete event.$url
    let promise = await user.getUserInfo(event)
    ctx.body = promise
  })
  app.router('user/initLogin', async (ctx, next) => {
    delete event.$url
    let promise = await user.initLogin(event)
    ctx.body = promise
  })

  return app.serve()
}
