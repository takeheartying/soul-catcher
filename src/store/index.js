import Vue from 'vue'
import Vuex from 'vuex'
import cst from './const'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    fromPageBack: '',
    count: 0,
    wxmobile: '',
    hasPopup: false
  },
  getters: {
    fromPageBack: state => {
      return state.fromPageBack
    }
  },
  mutations: {
    [cst.FROM_PAGE_BACK] (state, value) {
      state.fromPageBack = value
    },
    wxmobile: (state, value) => {
      state.wxmobile = value
    },
    hasPopup: (state, value) => {
      state.hasPopup = value
    }
  },
  actions: {}
})
