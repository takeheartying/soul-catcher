import Vue from 'vue'
import MpApp from './App'
import store from './store'
import cst from './store/const'
import api from '@/api'

Vue.config.productionTip = false
MpApp.mpType = 'app'

const vm = new Vue(MpApp)
vm.$mount()

wx.vm = vm
wx.$app = getApp()

Vue.prototype.$api = api
Vue.prototype.$app = wx.$app
Vue.prototype.$store = store
Vue.prototype.$cst = cst
Vue.prototype.$toast = function (text) {
  wx.showToast({
    title: text,
    icon: 'none',
    duration: 1000 + text.length * 100
  })
}
Vue.prototype.$loading = {
  show (title) {
    wx.showLoading({
      title
    })
  },
  hide () {
    wx.hideLoading()
  }
}
