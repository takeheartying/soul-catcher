<template>
  <section class="page-login">
    <!-- 用户名密码： -->
    <div class="page-login--pwd" v-if="!showChooseUserType">
      <div class="login-item">
        <label for="userName">用户名：</label>
        <input type="text" v-model="userName" placeholder="请输入用户名">
      </div>
      <div class="login-item">
        <label for="password">密码：</label>
        <input type="password" v-model="password" placeholder="请输入密码">
      </div>
      <div class="login-item btns">
        <button class="login-btn" @click="loginConfirm()">登录</button>
        <button class="login-btn" @click="register()">注册</button>
      </div>
    </div>
    <!-- 选择角色： -->
    <div class="page-login--btns" v-if="showChooseUserType">
      <h1 class="title">请选择角色</h1>
      <button @click="confirmClick('1')" class="choose-btn">我是学生</button>
      <button @click="confirmClick('2')" class="choose-btn">我是专家</button>
      <button @click="confirmClick('3')" class="choose-btn">我是家长</button>
      <button @click="confirmClick('0')" class="choose-btn">我是管理员</button>
      <button @click="returnBack()" class="choose-btn return-btn">返回登录</button>
    </div>
    <!-- 登录授权：     -->
    <g-auth ref="auth"></g-auth>
  </section>
</template>
<script>
import api from '@/api'
export default {
  data () {
    return {
      userName: '',
      password: '',
      showChooseUserType: false // 是否展示选择角色
    }
  },
  methods: {
    // 注册--1.选择角色：
    async confirmClick (userType) { // 0 管理员 1 学生 2 专家 3 家长
      this.submitInfo(userType)
    },
    submitInfo (userType) { // 注册--2.填写信息
      wx.showModal({
        content: '确认该角色？',
        showCancel: true, // 是否显示取消按钮
        cancelColor: 'skyblue', // 取消文字的颜色
        confirmColor: 'skyblue', // 确定文字的颜色
        success: async res => {
          if (res.cancel) {
            // 点击取消,默认隐藏弹框
          } else {
            // 点击确定
            if (userType) {
              // 前往信息修改添加页：
              wx.navigateTo({url: '/pages/my/detail/main?userType=' + userType})
            }
          }
        }
      })
    },
    returnBack () {
      this.showChooseUserType = false
    },
    register () {
      this.showChooseUserType = true
    },
    async loginConfirm () { // 用户名密码输入
      if (!this.userName) {
        this.$toast('请输入用户名！')
        return false
      }
      if (!this.password) {
        this.$toast('请输入密码！')
        return false
      }
      // 登录api:
      await api.user.login({
        userName: this.userName,
        password: this.password,
        userType: this.$app.globalData.userInfo.userType,
        avatarUrl: this.$app.globalData.userInfo.avatarUrl
      }).then(res => {
        if (res && res.data) {
          // 设置全局数据：
          this.$app.globalData.loginState = 'done'
          this.$app.globalData.userInfo = {
            userId: res.data.userId,
            userName: res.data.userName,
            name: res.data.name,
            avatarUrl: res.data.avatarUrl,
            openId: res.data.openId,
            userType: res.data.userType
          }
          this.$app.globalData.userType = res.data.userType

          this.$toast('登录成功！')
          // 前往个人中心主页：
          wx.reLaunch({url: `/pages/my/personal-center/main`})
        } else {
          this.$toast(res.message || '登录失败')
        }
      }).catch(err => {
        console.log(err)
        this.$toast('系统错误！')
      })
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '用户登录'
    })
    // 判断是否登录：
    this.$refs.auth.run(false).then(() => {
      console.log(this.$app.global.loginState)
    })
  }
}
</script>
<style lang="less">
.page-login {
  background: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .page-login--btns {
    height: 260px;
    margin-top: -100px;
    padding: 20px;
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: space-between;
    .choose-btn {
      margin: 0 auto;
      width: 180px;
      height: 40px;
      line-height:20px;
      background: rgb(255, 209, 97);
      color: #fff;
      padding: 10px 20px;
      font-size: 16px;
    }
    .return-btn {
      margin-top: 10px;
    }
    .title {
      color: rgb(255, 209, 97);
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
  .page-login--pwd {
    .login-item {
      font-size: 16px;
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      label {
        width: 70px;
        padding: 10px 0px;
      }
      input {
        padding: 5px 10px;
        border:1px solid #eee;
      }
      .login-btn {
        font-size: 16px;
        width: 80px;
        padding: 5px 10px;
      }
    }
    .btns {
      padding: 10px 20px;
      justify-content: space-around;
    }
  }
}
</style>
