const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'soul-catcher-env-2f8134'
})

// 图片上传
const uploadFile = async (event) => {
  let promise = await cloud.uploadFile({
    cloudPath: event.cloudPath, // 云存储图片名字
    fileContent: event.filePath // 要上传文件的内容 Buffer 或 fs.ReadStream
  }).then(res => {
    console.log('upload云函数----上传----结果：    ', res)
    return res
  }).cath(err => {
    return err
  })
  return promise
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
