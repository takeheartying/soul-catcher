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
      fileContent: Buffer.from(event.file, 'base64')
    })
  } catch (e) {
    return e
  }
}
// 单个图片删除
const deleteFile = async (event) => {
  if (event.originPic) {
    return {
      message: '没有旧图片',
      code: '-1'
    }
  }
  try {
    return await cloud.deleteFile({
      fileList: [event.originPic] // 云文件 ID 字符串数组
    }).then(res => {
      console.log(res)
      return res
    })
  } catch (e) {
    console.log(e)
    return e
  }
}
module.exports = {
  uploadFile,
  deleteFile
}
