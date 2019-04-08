/**
 * 该文件存放一些基础的工具类函数
 */

/**
 * 将回调封装为Promise更优雅的处理异步
 * @param func
 * @param obj
 * @returns {Promise<any>}
 */
function cbToPromise (func, obj) {
  return new Promise((resolve, reject) => {
    func({
      ...obj,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * json数据 深拷贝方法
 * 注意：如果属性值为function则该属性进行引用（浅拷贝）
 * var a = {name: 'zs', age: 13, info: {i: 1, j: 2}, skills: [1, 1, 3]}
 * var b = {age2: 22, info: {i: 3, k: [1]}, skills: [0, 1, {i: 2}]}
 * merge(a, b)
 */
function merge (target, ...sources) {
  for (let source of sources) {
    for (let i in source) {
      if (typeof source[i] === 'object') {
        if (typeof target[i] !== 'object') {
          if (Array.isArray(source[i])) {
            target[i] = []
          } else {
            target[i] = {}
          }
        }
        merge(target[i], source[i])
      } else {
        target[i] = source[i]
      }
    }
  }
  return target
}
export default {
  cbToPromise,
  merge
}
