<template>
  <div class="tab-bar-container">
    <ul class="my-tab-bar" v-if="userType && tabBars && tabBars.length">
      <navigator :url="item.pagePath" open-type="reLaunch"
      :class="item.pagePath === curUrl ? 'my-tab-bar-item navigator-hover' : 'my-tab-bar-item'" v-for="(item, index) in tabBars" :key="index">
        <li>
          <image class="icon" :src="item.pagePath === curUrl ? item.selectedIconPath : item.iconPath"></image>
          <div class="text">{{item.text}}</div>
        </li>
      </navigator>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    userType: {
      type: String,
      default: ''
    },
    curUrl: {
      type: String,
      default: '/pages/home/main'
    }
  },
  data () {
    return {
      tabBars: []
    }
  },
  onLoad () {
    if (this.userType) {
      let knowledgeTab = {
        index: 0,
        text: '首页',
        pagePath: '/pages/home/main',
        iconPath: '/static/tabs/homepage.png',
        selectedIconPath: '/static/tabs/homepage-active.png'
      }
      let testTab = {
        index: 1,
        pagePath: '/pages/test/home/main',
        text: '测试',
        iconPath: '/static/tabs/test.png',
        selectedIconPath: '/static/tabs/test-active.png'
      }
      let consultTab = {
        index: 2,
        pagePath: '/pages/consult/home/main',
        text: '咨询',
        iconPath: '/static/tabs/consult.png',
        selectedIconPath: '/static/tabs/consult-active.png'
      }
      let personalCenterTab = {
        index: 3,
        pagePath: '/pages/my/personal-center/main',
        text: '我的',
        iconPath: '/static/tabs/my.png',
        selectedIconPath: '/static/tabs/my-active.png'
      }
      if (this.userType === '1') { // 学生
        this.tabBars = [knowledgeTab, testTab, consultTab, personalCenterTab]
      }
      if (this.userType === '2') { // 专家
        this.tabBars = [knowledgeTab, testTab, consultTab, personalCenterTab]
      }
      if (this.userType === '3') { // 家长
        this.tabBars = [knowledgeTab, testTab, consultTab, personalCenterTab]
      }
    }
  }
}
</script>

<style lang="less">
.tab-bar-container {
  height: 54px;
  margin-top: 20px;
}
.my-tab-bar {
  width: 100%;
  height: 54px;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 5px;
  background: rgb(250, 250, 250);
  font-size: 12px;
  color:#8A8A8A;
  box-shadow: 3rpx 3rpx 3rpx 3rpx #aaa;
  z-index: 9999;
  .my-tab-bar-item {
    height: 54px;
    text-align: center;
    color: #666;
    background-color: #fafafa;
    image {
      height: 32px;
      width: 32px;
      position: relative;
      top: 5px;
    }
  }
  .navigator-hover{
    .text {
      color: #FFD161;
    }
  }
}
</style>
