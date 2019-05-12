<template>
  <div class="expert-info-card" v-if="followInfo" @click="goToUserHomePage()">
    <image mode="aspectFit" :src="followInfo.avatar" class="left-part"></image>
    <div class="right-part">
      <p class="line1" v-if="followInfo.userType === '2'">{{followInfo.name}} <span>{{followInfo.authorAcademicTitle}}</span></p>
      <p class="line1" v-if="followInfo.userType !== '2'">{{followInfo.name || followInfo.nickName}}</p>
      <p class="line2" v-if="followInfo.userType !== '3'">{{followInfo.organization}}</p>
      <p class="line3" v-if="followInfo.tagList && followInfo.userType === '2'">
        <span class="tag" v-for="(tag, index) in followInfo.tagList" :key="index">{{tag}}</span>
      </p>
      <p class="line4" :style="followInfo.userType === '3' ? 'font-size: 28rpx;' : ''">
        <span>咨询数&nbsp;{{followInfo.consultNum}}</span>
        <span v-if="userType !== '3'">关注者&nbsp;{{followInfo.fanNum}}</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    followInfo: { // 关注者信息
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      url: ''
    }
  },
  methods: {
    goToUserHomePage () { // 查看用户主页
      if (this.url) {
        wx.navigateTo({url: this.url})
      }
    }
  },
  onLoad () {
    if (this.followInfo) {
      // 根据 关注者的用户类型不同 选择不同的主页
      if (this.followInfo.userType === '1') {
        this.url = `/pages/student/detail/main?id=${this.followInfo.id}`
      } else if (this.followInfo.userType === '2') {
        this.url = `/pages/expert/detail/main?id=${this.followInfo.id}`
      } else {
        this.url = ''
      }
    }
  }
}
</script>

<style lang="less">
@import '~@/styles/functions.less';
.expert-info-card {
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
  .right-part {
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
    .line4 {
      font-size:10px;
      span {
        display: inline-block;
        margin-right: 8px;
        color: rgb(145, 139, 139);
      }
    }
  }
}
</style>
