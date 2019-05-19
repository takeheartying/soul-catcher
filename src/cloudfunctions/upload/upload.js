const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'soul-catcher-env-2f8134'
})
// 图片上传
const uploadFile = async (event) => {
  try {
    return await cloud.uploadFile({
      cloudPath: event.cloudPath,
      // fileContent: new Buffer(event.file, 'base64')
      fileContent: Buffer.from(event.file, 'base64')
    })
  } catch (e) {
    return e
  }
}
// 图片删除
const deleteFile = async (event) => {
  let promise = {}
  if (event.uploadParams) {
    promise = await cloud.deleteFile({
      fileList: event.fileList
    }).then(res => {
      console.log('删除图片成功！', res)
      return res
    })
  }
  return promise
}
module.exports = {
  uploadFile,
  deleteFile
}
