<template>
  <!-- 专家查看-- 我的咨询： 有学生的咨询室显示学生信息，没有学生的咨询室显示家长信息 -->
  <div class="consult-info-card" v-if="consultInfo" @click="goToConsultDetail()">
    <image mode="aspectFit" :src="consultInfo.avatar" class="left-part" @click.stop="goToUserHomePage()"></image>
    <div class="middle-part">
      <p class="line1" v-if="userType !== '2'">{{consultInfo.name}} <span>{{consultInfo.authorAcademicTitle}}</span></p>
      <p class="line1" v-if="userType === '2'">{{consultInfo.name || consultInfo.nickName}}</p>
      <p class="line2" v-if="userType === '1' || userType === '3'">{{userType === '1' ? '状况评分' : '孩子状况评分'}}：&nbsp;{{consultInfo.consultScore || '暂无'}}</p>
      <p class="line3" v-if="consultInfo.consultTime">
        <span>咨询时间：&nbsp;{{consultInfo.consultTime}}</span>
      </p>
      <p class="line4" v-if="consultInfo.tagList && userType !== '2'">
        <span class="tag" v-for="(tag, index) in consultInfo.tagList" :key="index">{{tag}}</span>
      </p>
    </div>
    <!-- 咨询状态： 邀请中 0   待同意 1   已同意 2   已关闭 3 -->
    <div class="right-part" v-if="consultInfo.consultStatusDesc !== '邀请中' && consultInfo.consultScore">
      <button class="right-part-btn" @click.stop="lookOverScore()">查看评分</button>
    </div>
    <div class="right-part" v-if="consultInfo.consultStatusDesc === '邀请中'">
      <button class="right-part-btn" @click.stop="agreeJoin()">同意邀请</button>
    </div>    
  </div>
</template>
<script>
import api from '@/api'
export default {
  data () {
    return {
      userType: '',
      url: ''
    }
  },
  props: {
    consultInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    lookOverScore () { // 查看评分
      let scoreType = ''
      if (this.userType === '1' || this.userType === '3') { // 家长或学生 查看 学生状况评分
        scoreType = 'student'
      } else if (this.userType === '2') {
        scoreType = 'expert'
      }
      if (scoreType) {
        wx.navigateTo({
          url: `/pages/score/detail/main?id=${this.consultInfo.consultorId}&scoreType=${scoreType}`
        })
      }
    },
    goToUserHomePage () { // 去用户主页
      if (this.consultInfo.userType === '1') {
        wx.navigateTo({url: `/pages/student/detail/main?id=${this.consultInfo.consultorId}`})
      } else if (this.consultInfo.userType === '2') {
        wx.navigateTo({url: `/pages/expert/detail/main?id=${this.consultInfo.consultorId}`})
      }
    },
    goToConsultDetail () {
      if (this.url) {
        wx.navigateTo({url: this.url})
      }
    },
    async agreeJoin () { // 同意邀请
      let that = this
      wx.showModal({
        content: '同意邀请？',
        showCancel: true, // 是否显示取消按钮
        cancelColor: 'skyblue', // 取消文字的颜色
        confirmColor: 'skyblue', // 确定文字的颜色
        success: async function (res) {
          if (res.cancel) {
            // 点击取消,默认隐藏弹框
          } else {
            // 点击确定
            await api.my.agreeConsult({ // 同意别邀请--进入
              consultId: that.consultInfo.id,
              hasJoined: true
            }).then((res) => {
              if (res) {
                that.consultInfo.consultStatusDesc = '已同意'
                that.consultInfo.consultStatus = 1
              }
            }).catch(err => {
              console.log(err)
            })

            // mock数据：
            that.consultInfo.consultStatusDesc = '已同意'
            that.consultInfo.consultStatus = 1
          }
        }
      })
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    if (this.consultInfo.consultStatusDesc !== '邀请中') {
      this.url = '/pages/consult/detail/main?id=' + this.consultInfo.id
    } else {
      this.url = ''
    }
  }
}
</script>

<style lang="less">
@import '~@/styles/functions.less';
.consult-info-card {
  padding: 12px 15px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: row;
  .left-part {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
  }
  .middle-part {
    flex: 1;
    .line1 {
      font-size: 16px;
      font-weight: bolder;
      span {
        display: inline-block;
        margin-left: 5px;
        font-size: 12px;
        color: rgb(187, 186, 186);
      }
    }
    .line2 {
      font-size: 14px;
      .fn_ellipsis();
      margin-top: 3px;
    }
    .line3 {
      font-size:14px;
      span {
        display: inline-block;
        margin-right: 8px;
      }
    }
    .line4 {
      margin: 5px 0;
      font-size: 12px;
      color:  rgb(187, 186, 186);
      span {
        display: inline-block;
        padding: 0 4px;
        margin-right: 8px;
        border: 1px solid #eee;
        border-radius: 3px;
      }
    }
  }
  .right-part {
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    .right-part-btn {
      border-radius: 10px;
      border: 1px solid #FFD161;
      font-size: 14px;
      color: #FFD161;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      height: 30px;
    }
  }
}
</style>
