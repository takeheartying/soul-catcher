import util from './util.js'
// 单个文件【图片】上传：
const uploadFile = async (params, callBack) => {
  await wx.getFileSystemManager().readFile({
    filePath: params.filePath, // 选择图片返回的相对路径
    encoding: 'base64', // 编码格式
    success: async (res) => {
      debugger
      if (res && res.data) {
        wx.cloud.callFunction({
          name: 'upload',
          data: {
            $url: 'upload/add',
            cloudPath: 'pictures/' + util.formatDate(new Date()) + '.jpg',
            file: res.data
          }
        }).then(_res => {
          if (_res && _res.result && _res.result.fileID) {
            params.fileID = _res.result.fileID
            callBack(params)
          }
        })
      }
    },
    fail: (err) => {
      console.log(err || '上传失败')
    }
  })
}

export default {
  uploadFile
}
