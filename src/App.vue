<script>
import Utils from '@/lib/utils'
/**
 * 封装微信方法改callback为promise，避免回调地狱式的嵌套
 */
let $p = {}
for (let key in wx) {
  if (typeof wx[key] === 'function') {
    $p[key] = obj => Utils.cbToPromise(wx[key], obj)
  }
}
wx.$p = $p

export default {
  onLaunch: function () {
    if (!wx.cloud) {

    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'soul-catcher-env-2f8134'
      })
    }
  },
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
  },
  log () {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style lang="less">
@import "./styles/_app.less";
@import "./styles/variables.less";
@import "./styles/functions.less";
@import "./styles/common.less";
@import "./styles/g-loading.less";
</style>
<style>
@import './styles/zanui.wxss';
@import "./styles/iconfont.css";
</style>

