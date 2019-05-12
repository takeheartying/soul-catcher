<template>
  <navigator class="consult-info-card" v-if="consultInfo" :url="'/pages/expert/detail/main?id=' + consultInfo.id" >
    <image mode="aspectFit" :src="consultInfo.avatar" class="left-part"></image>
    <div class="middle-part">
      <p class="line1">{{consultInfo.name || consultInfo.nickName}} <span>{{consultInfo.authorAcademicTitle}}</span></p>
      <p class="line2">评分：&nbsp;{{consultInfo.AverageScore ? consultInfo.AverageScore : '暂无'}}</p>
      <p class="line4" v-if="consultInfo.tagList">
        <span class="tag" v-for="(tag, index) in consultInfo.tagList" :key="index">{{tag}}</span>
      </p>
    </div>
    <!-- 专家不可以咨询其他专家,但可以查看咨询主页 -->
    <div class="right-part" v-if="userType !== '2'">
      <button class="consult-btn" @click.stop="clickConsult(consultInfo)">咨询</button>
    </div>
  </navigator>
</template>
<script>
import api from '@/api'
export default {
  data () {
    return {
      userType: ''
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
    async initConsult (consultInfo) { // 新建咨询室
      let consultId = ''
      await api.consult.addConsult({
        expertId: consultInfo.id
      }).then(res => {
        consultId = res.consultId
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      consultId = '3444444'
      return consultId
    },
    clickConsult (consultInfo) { // 前往咨询室
      if (!consultInfo.isConsulting) {
        // 新建咨询室：
        consultInfo.consultId = this.initConsult(consultInfo)
      }
      wx.navigateTo({url: `/pages/consult/detail/main?id=${consultInfo.consultId}`})
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
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
    .line4 {
      margin-top: -2px;
      font-size: 12px;
      color:  rgb(187, 186, 186);
      span {
        display: inline-block;
        padding: 0 4px;
        margin-right: 8px;
        border: 1px solid #eee;
        border-radius: 3px;
        margin-top: 10px;
      }
      span:last-child {
        margin-right: 0;
      }
    }
  }
  .right-part {
    margin-left: 10px;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:row;
    .consult-btn {
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
