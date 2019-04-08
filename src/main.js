import Vue from 'vue'
import MpApp from './App'
import mnApp from './_app'
import store from './store'
import cst from './store/const'
import api from '@/api'
import GLoading from '@/components/g-loading/index.vue'
import GAuthmodal from '@/components/g-authmodal/index.vue'

// 全局组件
Vue.component('g-loading', GLoading)
Vue.component('g-authmodal', GAuthmodal)

Vue.config.productionTip = false
MpApp.mpType = 'app'

const vm = new Vue(MpApp)
vm.$mount()

wx.vm = vm
App(mnApp)
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
