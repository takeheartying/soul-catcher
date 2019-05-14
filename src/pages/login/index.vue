<template>
  <section class="page-login">
    <!-- 选择角色： -->
    <div class="page-login--btns" v-if="showChooseUserType">
      <h1 class="title">请选择角色</h1>
      <button @click="confirmClick('1')" class="choose-btn">我是学生</button>
      <button @click="confirmClick('2')" class="choose-btn">我是专家</button>
      <button @click="confirmClick('3')" class="choose-btn">我是家长</button>
      <button @click="confirmClick('0')" class="choose-btn">我是管理员</button>
    </div>
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
        <button class="login-btn" @click="loginConfirm()">确定</button>
        <button class="login-btn" @click="returnBack()">返回</button>
      </div>
    </div>
  </section>
</template>
<script>
import api from '@/api'
export default {
  mounted () {
    wx.setNavigationBarTitle({
      title: '选择角色'
    })
  },
  data () {
    return {
      userName: '',
      password: '',
      showChooseUserType: true // 是否展示选择角色
    }
  },
  methods: {
    // 初次登录后选择角色：
    async confirmClick (userType) { // userType: '1', // 0 管理员 1 学生 2 专家 3 家长
      if (userType === '0' && this.showChooseUserType) {
        this.showChooseUserType = false
        return false
      } else {
        this.submitInfo(userType)
      }
    },
    submitInfo (userType) {
      let that = this
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
            await api.common.updateUserType({
              userId: that.$app.globalData.userId,
              userType: userType
            }).then(res => {
              if (res.success) {
                console.log('更改成功')
                that.$app.globalData.userType = userType
                that.$app.globalData.userInfo.userType = userType
              } else {
                console.log('更改失败')
              }
            }).catch(err => {
              console.log(err)
              that.$toast('系统错误')
            })

            // mock数据：
            that.$app.globalData.userType = userType
            that.$app.globalData.userInfo.userType = userType

            if (userType) {
              // 前往信息修改页：
              wx.navigateTo({url: '/pages/my/detail/main'})
            }
          }
        }
      })
    },
    returnBack () {
      this.showChooseUserType = true
    },
    loginConfirm () { // 用户名密码输入
      if (!this.userName) {
        this.$toast('请输入用户名！')
        return false
      }
      if (!this.password) {
        this.$toast('请输入密码！')
        return false
      }
      if (this.userName !== '111111') {
        this.$toast('请输入正确的用户名！')
        return false
      }
      if (this.password !== '111111') {
        this.$toast('请输入正确的密码！')
        return false
      }
      this.confirmClick('0')
    }
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
