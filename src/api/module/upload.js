export default function (params) {
  const app = getApp()
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: params.url.indexOf('//') > -1 ? params.url : app.globalData.gatewayServer + params.url,
      filePath: params.path,
      name: params.name,
      header: {
        'lxy-authtoken': app.globalData.loginInfo.loginToken,
        'lxy-appid': 'soul-catcher',
        'Content-Type': 'multipart/form-data'
      },
      formData: {
        bizcode: 0
      },
      success (res) {
        const resData = (JSON.parse(res.data))
        if (resData.code !== '0' || resData.flag !== '0') {
          wx.showToast({
            title: '上传图片失败',
            icon: 'none',
            duration: 2000
          })
          return reject(resData.message)
        }
        resolve(resData.data)
      },
      fail: e => {
        wx.showToast({
          title: '网络出错',
          icon: 'none',
          duration: 2000
        })
      }
    })
  })
}
