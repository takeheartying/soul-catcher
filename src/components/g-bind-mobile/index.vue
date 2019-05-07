<template>
  <section class="g-bind-mobile">
    <icon type="cancel" size="20" color="#ddd" class="close-bind" @click="close"/>
    <div class="error-tip" v-if="errorMsg">{{errorMsg}}</div>
    <div class="tit">绑定手机号</div>
    <div class="bind-ipt">
      <input v-if="value" placeholder="仅支持中国大陆手机号" type="number" maxlength="11" v-model.trim="mobile" class="input-left"/>
    </div>
    <div class="bind-ipt">
      <input v-if="value" placeholder="请输入验证码" type="number" maxlength="10" v-model.trim="code" class="input-left" />
      <span @click="sendCode" class="input-right" :class="active ? 'can-send' : ''">{{sendText}}</span>
    </div>
    <button size="default" @click="bind" class="wy-btn">确定</button>
  </section>
</template>
<script>
import { hexMD5 } from 'public/lib/md5'

const reg = /^1[\w|*]{10}$/
export default {
  props: {
    value: Boolean
  },
  data () {
    return {
      states: {
        loading: false
      },
      countDownTime: 60,
      code: '',
      mobile: '',
      sendText: '发送验证码',
      errorMsg: ''
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
      this.$emit('cancel')
    },
    countDown () {
      let time = this.countDownTime
      if (time) {
        this.sendText = `已发送（${time}）`
      } else {
        this.sendText = '重新发送'
        this.countDownTime = 60
        return
      }
      --this.countDownTime
      setTimeout(_ => {
        this.countDown()
      }, 1000)
    },
    sendCode () {
      if (reg.test(this.mobile) && this.countDownTime === 60) {
        this.errorMsg = ''
        let mobile = this.mobile
        let smstype = this.$app.globalData.loginInfo.smsType
        let signdata = hexMD5(smstype + mobile)
        this.$api.common.getMobileCode({
          mobile: mobile,
          signature: signdata,
          type: 15
        }).then(res => {
          if (res.flag !== '0') {
            throw new Error(res.message)
          }
          this.countDown()
        }).catch(e => {
          this.errorMsg = e.message || '验证码发送失败，请重试'
        })
      }
    },
    async bind () {
      let mobile = this.mobile
      let code = this.code
      if (this.states.loading) {
        return
      }
      if (mobile === '') {
        this.errorMsg = '请输入手机号码'
        return
      }
      if (code === '') {
        this.errorMsg = '请输入验证码'
        return
      }
      this.errorMsg = ''
      try {
        let res = await this.$api.common.mobileBind({
          mobile: mobile,
          secret: this.$app.globalData.loginInfo.secret,
          smsCaptcha: code,
          plat: 'mircowx'
        }, this.states)
        if (res.flag !== '0') {
          throw new Error(res.message)
        }
        this.$app.globalData.loginInfo.state = 1
        this.$app.globalData.loginInfo.loginToken = res.item.loginToken
        this.$emit('input', false)
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 2000
        })
        this.$emit('done')
      } catch (e) {
        this.errorMsg = e.message
      }
    }
  },
  watch: {
    'states.loading' (n) {
      if (n) {
        wx.showLoading({
          title: '绑定中'
        })
      } else {
        wx.hideLoading()
      }
    },
    'value' (n) {
      let wxmobile = this.$store.state.wxmobile
      if (n && wxmobile) {
        if (!wx._hasUseWxMobile) {
          wx._hasUseWxMobile = true
          this.mobile = wxmobile
        } else {
          this.mobile = wx._catchMobile
        }
      } else {
        wx._catchMobile = this.mobile
      }
      if (!n) {
        this.errorMsg = ''
      }
    }
  },
  computed: {
    active () {
      return reg.test(this.mobile)
    }
  }
}
</script>

<style lang="less">
@import "~@/styles/variables.less";
.g-bind-mobile {
  position: relative;
  width: 330px;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 10px;
  background-color: @color-main-white;
  .close-bind {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .error-tip {
    height: 24px;
    line-height: 24px;
    background-color: #fe3824;
    color: #fff;
    position: absolute;
    width: 100%;
    left: 0;
    top: 44px;
    text-align: center;
  }
  .tit {
    font-size: 15px;
    text-align: center;
    margin-bottom: 40px;
  }
  .bind-ipt {
    border: 1px solid #eee;
    height: 40px;
    display: flex;
    align-items: center;
    border-radius: 20px;
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 40px;
    padding: 0 10px;
  }
  .wy-btn {
    display: block;
  }
  .input-left {
    flex: 1;
    vertical-align: middle;
    float: left;
  }
  .input-right {
    color:#999;
    padding-left: 10px;
  }
  .can-send {
    color: #3f86ff;
  }
}
</style>
