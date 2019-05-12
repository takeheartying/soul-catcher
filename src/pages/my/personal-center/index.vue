<template>
  <section class="page-my-personal-center">
    <div class="inner-content">
      <navigator class="user-info" url="/pages/my/detail/main">
        <div class="avatar">
          <image class="avatar-pic" :src="userInfo.avatar"></image>
        </div>
        <div class="middle-info">
          <p class="nickname">{{userInfo.nickName}}</p>
          <p class="finish-tips">完善资料 <i class="iconfont icon-bianji"></i></p>
        </div>
        <div class="right-icon">
          <i class="iconfont icon-fanhui-copy"></i>
        </div>
      </navigator>
      <div class="row-functions">
        <navigator class="function-item"  url="/pages/my/follow/main" hover-class="none">
          <i class="iconfont icon-guanzhu"></i>
          <p>我的关注</p>
        </navigator>
        <navigator class="function-item"  url="/pages/my/comment/main" hover-class="none">
          <i class="iconfont icon-pinglun"></i>
          <p>我的评论</p>
        </navigator>
        <navigator class="function-item"  url="/pages/my/message/main" hover-class="none">
          <i class="iconfont icon-xiaoxi1"></i>
          <p>我的消息</p>
        </navigator>
      </div>
      <div class="column-functions">
        <navigator class="function-item" url="/pages/my/test/main" v-if="userType === '1'">
          <div class="left-part">
            <i class="iconfont icon-ceshi"></i>
          </div>
          <div class="right-part">
            <p>我的测试</p>
            <i class="iconfont icon-fanhui-copy"></i>
          </div>
        </navigator>
        <navigator class="function-item" url="/pages/my/consult/main">
          <div class="left-part">
            <i class="iconfont icon-zixun1"></i>
          </div>
          <div class="right-part">
            <p>我的咨询</p>
            <i class="iconfont icon-fanhui-copy"></i>
          </div>
        </navigator>
        <navigator class="function-item" url="/pages/my/record/list/main" v-if="userType === '1'">
          <div class="left-part">
            <i class="iconfont icon-xinlidangan"></i>
          </div>
          <div class="right-part">
            <p>心理档案</p>
            <i class="iconfont icon-fanhui-copy"></i>
          </div>
        </navigator>
        <navigator class="function-item" url="/pages/my/warn/main" v-if="userType === '1'">
          <div class="left-part">
            <i class="iconfont icon-yujing"></i>
          </div>
          <div class="right-part">
            <p>我的预警</p>
            <i class="iconfont icon-fanhui-copy"></i>
          </div>
        </navigator>
        <navigator class="function-item" url="/pages/knowledge/list/main?isShowMy=1" v-if="userType === '2'">
          <div class="left-part">
            <i class="iconfont icon-yujing"></i>
          </div>
          <div class="right-part">
            <p>我的知识库</p>
            <i class="iconfont icon-fanhui-copy"></i>
          </div>
        </navigator>
        <navigator class="function-item" :url="'/pages/student/detail/main?id=' + userInfo.studentId" v-if="userType === '3'">
          <div class="left-part">
            <i class="iconfont icon-yujing"></i>
          </div>
          <div class="right-part">
            <p>我的孩子</p>
            <i class="iconfont icon-fanhui-copy"></i>
          </div>
        </navigator>
      </div>
      <navigator class="contact-us" url="/pages/contact-us/main">
        联系我们
      </navigator>
    </div>
    <tab-bar :userType="userType" v-if="userType" :curUrl="'/pages/my/personal-center/main'"></tab-bar>
  </section>
</template>
<script>
import api from '@/api'
import tabBar from '@/components/tab-bar'

export default {
  data () {
    return {
      userInfo: {},
      userType: '' // 0 管理员 1 学生 2 专家 3 家长
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    if (this.userType && this.userType !== '0') { // userType: '1', // 0 管理员 1 学生 2 专家 3 家长
      wx.hideTabBar() // 显示自定义tabTab
    }
  },
  methods: {
    async getUserInfo () {
      await api.common.getUserInfo({
        userType: this.userType || '1'
      }).then(res => {
        this.userInfo = res || {}
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.userInfo = {
        avatar: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1293892983,611103898&fm=27&gp=0.jpg',
        nickName: '驾辕的位置',
        studentId: '323434' // 用户是家长的时候
      }
    }
  },
  mounted () {
    wx._this = this
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#63B8FF'
    })
    this.getUserInfo()
  },
  components: {
    tabBar
  }
}
</script>

<style lang="less">
@import '~@/styles/functions.less';
.page-my-personal-center {
  height: 100%;
  .user-info {
    color: #fff;
    background: #63B8FF;
    height: 100px;
    padding: 10px 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .avatar {
      margin-right: 20px;
      width: 80px;
      height: 80px;
      .avatar-pic {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 5px solid rgb(175, 214, 248);
      }
    }
    .middle-info {
      flex: 1;
      .nickname {
        margin-top: 20px;
        font-size: 16px;
        font-weight: bolder;
      }
      .finish-tips {
        font-size: 12px;
        .icon-bianji {
          margin-left: 4px;
          margin-top: 1px;
          display: inline-block;
          font-size: 16px;
        }
      }
    }
    .right-icon {
      width: 20px;
      line-height: 100%;
      .icon-fanhui-copy {
        font-size: 24px;
        line-height:75px;
      }
    }
  }
  .row-functions {
    background: #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    justify-items: center;
    padding: 1px 10px 10px 10px;
    .function-item {
      text-align: center;
      i {
        display: block;
        font-size: 36px;
      }
      .icon-guanzhu {
        color: rgb(82, 154, 212);
        font-size: 28px;
        margin-top: 9px;
        margin-bottom: 6px;
      }
      .icon-pinglun {
        color: rgb(235, 195, 109);
      }
      .icon-xiaoxi1 {
        color: rgb(155, 215, 219);
      }
      p {
        margin-top: -8px
      }
    }
  }
  .column-functions {
    margin-top: 10px;
    background: #fff;
    .function-item {
      height: 60px;
      display: flex;
      flex-direction: row;
      justify-items: center;
      .left-part {
        width: 50px;
        line-height: 60px;
        margin-right: 10px;
        text-align: right;
        i {
          font-size: 28px;
          color: #63B8FF;
        }
      }
      .right-part {
        flex: 1;
        border-bottom: 1px solid rgb(228, 225, 225);
        padding: 0 15px 0 0;
        line-height: 60px;
        display: flex;
        flex-direction: row;
        p {
          text-align: left;
          flex: 1;
          font-size: 14px;
        }
        i {
          width: 30px;
          float: right;
          text-align: right;
          color: #eee;
          display: inline-block;
          font-size: 24px;
        }
      }
    }
    .function-item :last-child {
      border: none;
    }
  }
  .contact-us {
    height: 70px;
    margin: 10px 0;
    background: #fff;
    display: flex;
    font-size: 16px;
    justify-content: center;
    align-items: center;
  }
}
</style>
