// 腾讯的云函数路由：
const TcbRouter = require('tcb-router')
const upload = require('./upload.js')
exports.main = (event, context) => {
  console.log('event', event)
  const app = new TcbRouter({ event })
  app.router('upload/add', async (ctx, next) => {
    let promise = await upload.uploadFile(event)
    ctx.body = promise
  })
  app.router('upload/delete', async (ctx, next) => {
    let promise = await upload.deleteFile(event)
    ctx.body = promise
  })

  return app.serve()
}
