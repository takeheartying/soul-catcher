<template>
  <div class="g-auth">
    <g-authmodal v-model="authModal" @cancel="cancel"></g-authmodal>
    <x-confirm v-model="showConfirm" @cancel="cancel" @getphonenumber="getphonenumber" openType="getPhoneNumber" content="您尚未绑定手机号，请先前往绑定"></x-confirm>
    <x-popup v-model="needAddMobile" direction="center" @maskClick="cancel">
      <g-bind-mobile v-model="needAddMobile" @done="done" @cancel="cancel"></g-bind-mobile>
    </x-popup>
  </div>
</template>

<script>
import GBindMobile from '@/components/g-bind-mobile/index.vue'
let resolveFn
let promise = Promise.resolve()
let isLock = false

export default {
  data () {
    return {
      authModal: false,
      showConfirm: false,
      needAddMobile: false
    }
  },
  methods: {
    run (needMobile) {
      if (isLock) return promise
      isLock = true
      promise = new Promise((resolve, reject) => {
        this.$app.loginInit(() => {
          this.authModal = true
        }).then(() => {
          resolveFn = resolve
          if (!needMobile || this.$app.globalData.loginInfo.state === 1) {
            this.done()
          } else if (this.$store.state.wxmobile) {
            this.needAddMobile = true // 临时账号,需绑定
          } else {
            this.needAddMobile = true
            // this.showConfirm = true // 获取微信手机号弹窗
            // wx.$p.login().then(res => {
            //   this.code = res.code
            // })
          }
        })
      })
      return promise
    },
    getphonenumber (e) {
      if (e.target.errMsg === 'getPhoneNumber:ok') {
        this.$api.common.decryptWxData({
          authCode: this.code,
          encryptedData: e.target.encryptedData,
          iv: e.target.iv,
          plat: 'mircowx'
        })
          .then(res => {
            this.$store.commit('wxmobile', Number(JSON.parse(res.item.info).purePhoneNumber))
            this.needAddMobile = true // 临时账号,需绑定
          })
      } else { // 用户拒绝获取微信手机号
        this.needAddMobile = true // 临时账号,需绑定
      }
    },
    done () {
      isLock = false
      resolveFn()
    },
    cancel () {
      isLock = false
      this.$emit('cancel')
    }
  },
  computed: {
    hasPopup () {
      return this.authModal || this.showConfirm || this.needAddMobile
    },
    storePopup () {
      return this.$store.state.hasPopup
    }
  },
  watch: {
    'hasPopup' (n) {
      this.$store.commit('hasPopup', n)
    },
    'storePopup' (n) {
      if (!n) {
        this.cancel()
        this.authModal = this.showConfirm = this.needAddMobile = false
        if (this.$app.globalData.loginState === 'logining') {
          this.$app.globalData.loginState = 'noLogin'
        }
      }
    }
  },
  components: {
    GBindMobile
  }
}
</script>
