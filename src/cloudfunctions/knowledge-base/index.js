// 腾讯的云函数路由：
const TcbRouter = require('tcb-router')
// 所有的知识库api:
const knowledgeBase = require('./knowledge-base.js')

// 按请求给云函数归类: 将相似的请求归类到同一个云函数处理
/*
  入参：
  {
    tagType: '1'
    knowledgeType: 'article',
    searchType: 'newTime', 或 'mostComment'
    pageSize: 3,
    pageNo: 1
  }
*/
exports.main = (event, context) => {
  console.log('event', event)
  const app = new TcbRouter({ event })
  app.router('knowledge/list', async (ctx, next) => {
    let promise = await knowledgeBase.getKnowledgeBaseList(event)
    ctx.body = promise
  })
  app.router('knowledge/detail', async (ctx, next) => {
    let promise = await knowledgeBase.getKnowledgeDetailById(event)
    ctx.body = promise
  })
  app.router('knowledge/update', async (ctx, next) => {
    let promise = await knowledgeBase.updateKnowledge(event)
    ctx.body = promise
  })

  return app.serve()
}
