<template>
  <section class="page-login">
    <!-- 选择角色： -->
    <div class="page-login--btns">
      <h1 class="title">请选择角色</h1>
      <button @click="confirmClick('1')" class="choose-btn">我是学生</button>
      <button @click="confirmClick('3')" class="choose-btn">我是家长</button>
      <button @click="confirmClick('2')" class="choose-btn">我是专家</button>
      <button @click="confirmClick('0')" class="choose-btn">我是管理员</button>
    </div>
  </section>
</template>
<script>
export default {
  mounted () {
    wx._this = this
    wx.setNavigationBarTitle({
      title: '选择角色'
    })
  },
  methods: {
    confirmClick (userType) { // userType: '1', // 0 管理员 1 学生 2 专家 3 家长
      let that = this
      wx.showToast({
        title: '确认该角色？',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result) => {
          that.$app.globalData.userType = userType
          if (userType === '0') {
            // 前往管理员后台首页：
            wx.navigateTo({url: '/pages/manager/home/main'})
          } else {
            // 前往普通用户首页--知识库：
            wx.navigateTo({url: `pages/home/main`})
          }
        },
        fail: () => {},
        complete: () => {}
      })
    }
  }
}
</script>
<style lang="less">
.page-login {
  background: #fff;
  height: 100%;
  display: flex;
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
}
</style>
