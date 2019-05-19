import util from './util.js'
// 单个文件【图片】上传：
const uploadFile = async (params, callBack) => {
  let promise = await new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath: params.filePath, // 选择图片返回的相对路径
      encoding: 'base64', // 编码格式
      success: async (res) => {
        if (res && res.data) {
          await wx.cloud.callFunction({ // 图片上传
            name: 'upload',
            data: {
              $url: 'upload/add',
              cloudPath: 'pictures/' + util.formatDate(new Date()) + '.jpg',
              file: res.data
            }
          }).then(_res => {
            if (_res && _res.result && _res.result.fileID) {
              params.message = '图片上传成功！'
              params.fileID = _res.result.fileID
              resolve(params)
              return params
            }
          }).then(async params => { // 原图片删除
            await wx.cloud.callFunction({ // 图片上传
              name: 'upload',
              data: {
                $url: 'upload/delete',
                originPic: params.originPic
              }
            }).then(res => {
              params.message = '原图片删除成功！'
            }).catch(err => {
              params.message = '原图片删除失败！'
              console.log(err)
              resolve(params)
            })
            resolve(params)
          }).catch(err => {
            reject(err)
            return err
          })
        }
      },
      fail: (err) => {
        console.log(err || '上传失败')
        reject(err)
      }
    })
  })
  return promise
}

export default {
  uploadFile
}
