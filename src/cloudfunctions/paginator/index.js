
// 分页：
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'soul-catcher-env-2f8134'
})
const db = cloud.database()
exports.main = async (event, context) => {
  let dbName = event.dbName // 集合名称
  let filter = event.filter ? event.filter : null // 筛选条件，默认为空
  let pageNo = event.pageNo || 1
  let pageSize = event.pageSize || 10 // 默认十条数据
  let orderBy = event.orderBy || {} // {fieldName: 字段名, order: 升降序 【asc,desc】}
  const countRes = await db.collection(dbName).where(filter).count() // 获取搜索到的集合总数 -- 结果
  const totalCount = countRes.total // 得到总记录数
  const pageCount = Math.ceil(totalCount / pageSize) // 总页数
  const finished = (pageNo >= pageCount) // 提示前端是否还有数据

  console.log('event:', event)
  // 将所有结果返回给前端：
  if (Object.keys(orderBy).length) { // 排序查找 [目前仅支持单个字段排序]
    console.log('orderBy排序：', orderBy)
    return db.collection(dbName).where(filter).orderBy(orderBy.fieldName, orderBy.order).skip((pageNo - 1) * pageSize).limit(pageSize).get()
      .then(res => {
        res.pageNo = pageNo
        res.pageCount = pageCount
        res.totalCount = totalCount
        res.finished = finished
        return res
      })
  } else {
    return db.collection(dbName).where(filter).skip((pageNo - 1) * pageSize).limit(pageSize).get()
      .then(res => {
        res.pageNo = pageNo
        res.pageCount = pageCount
        res.totalCount = totalCount
        res.finished = finished
        return res
      })
  }
}
