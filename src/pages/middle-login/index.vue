<template>
  <div class="page-middle-login">
    <header>
      <img class="img-logo" :src="imgUrl" alt="心灵捕手">
    </header>
    <div class="btn-wrap">
      <button class="btn-log" @click="quickLogin">微信登录</button>
      <button class="btn-back" @click="backToHome">返回首页</button>
    </div>
    <footer>
      捕捉心灵 重返快乐
    </footer>
    <g-loading :loading="loading"></g-loading>
    <g-authmodal v-model="authModal"></g-authmodal>
  </div>
</template>

<script>
import GLoading from '@/components/g-loading/index.vue'
import GAuthmodal from '@/components/g-authmodal/index.vue'
export default {
  data () {
    return {
      loading: false,
      authModal: false,
      imgUrl: require('@/img/common/soul-catcher-logo.png')
    }
  },
  components: {
    GLoading,
    GAuthmodal
  },
  computed: {
    backUrl () {
      return this.$root.$mp.query.target || '/pages/home/main'
    }
  },
  methods: {
    quickLogin () {
      this.loading = true
      this.$app.loginInit(() => {
        this.authModal = true
      }).then(() => {
        this.loading = false
        wx.navigateBack({ delta: 1 })
      })
    },
    backToHome () {
      wx.switchTab({ url: '/pages/home/main' })
    }
  }
}
</script>

<style lang="less">
.page-middle-login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ffffff;
  header {
    text-align: center;
    .img-logo {
      width: 60px;
      height: 60px;
    }
  }
  .btn-wrap {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    button {
      width: 100%;
      font-size: 14px;
      line-height: 40px;
      height: 40px;
      border-radius: 40px;
      outline: 0;
    }
    .btn-log {
      color: #ffffff;
      background-color: #2f7fe2;
    }
    .btn-back {
      margin-top: 20px;
      color: #2f7fe2;
      border: 1px solid #2f7fe2;
    }
  }
  footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 20px;
    font-size: 12px;
    color: #83889A;
    text-align: center;
  }
}
</style>
