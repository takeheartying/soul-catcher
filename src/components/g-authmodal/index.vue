<template>
  <section class="g-authmodal" v-show="value">
    <div class="g-automodal--content">
      <div class="g-authmodal--title">登录提示</div>
      <div class="g-authmodal--detail">小程序需要您的授权才能提供更好的服务</div>
      <div class='g-authmodal--footer'>
        <button class='g-authmodal--btn' open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="closeModal">知道了</button>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    value: Boolean
  },
  methods: {
    closeModal () {
      this.$emit('input', false)
    },
    bindGetUserInfo (e) {
      if (e.target.errMsg === 'getUserInfo:ok') {
        this.$app.wyLogin(e.target)
      } else {
        this.$app.globalData.loginState = 'fail'
        this.$emit('cancel')
      }
    }
  }
}
</script>

<style lang="less">
  /*授权弹窗*/
.g-authmodal{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
}
.g-automodal--content {
  position:fixed;
  z-index:5000;
  width:80%;
  max-width:300px;
  top:50%;
  left:50%;
  -webkit-transform:translate(-50%, -50%);
  transform:translate(-50%, -50%);
  background-color:#FFFFFF;
  text-align:center;
  border-radius:3px;
  overflow:hidden;
}
.g-authmodal--title{
    font-size: 18px;
    padding: 15px 15px 5px;
}
.g-authmodal--detail{
    padding: 5px 15px 10px;
    min-height: 40px;
    font-size: 16px;
    line-height: 1.3;
    word-wrap: break-word;
    word-break: break-all;
    color: #999999;
}
.g-authmodal--footer{
    display: flex;
    align-items: center;
    position: relative;
    line-height: 45px;
    font-size: 17px;
}
.g-authmodal--btn{
    display: block;
    -webkit-flex: 1;
    flex: 1;
    position: relative;
    color: #3CC51F;
}
</style>
