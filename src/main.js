import Vue from 'vue'
import MpApp from './App'
import mnApp from './_app'
import store from './store'
import cst from './store/const'
import api from '@/api'
import XPopup from '@/components/x-popup/index.vue'
import XConfirm from '@/components/x-confirm/index.vue'
import XButton from '@/components/x-button/index.vue'
import GLoading from '@/components/g-loading/index.vue'
import GAuthmodal from '@/components/g-authmodal/index.vue'
import GAuth from '@/components/g-auth/index.vue'
import GItem from '@/components/g-item/index.vue'

// 全局组件
Vue.component('x-popup', XPopup)
Vue.component('x-confirm', XConfirm)
Vue.component('x-button', XButton)
Vue.component('g-loading', GLoading)
Vue.component('g-authmodal', GAuthmodal)
Vue.component('g-auth', GAuth)
Vue.component('g-item', GItem)

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
