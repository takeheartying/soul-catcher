<template>
  <section class="page-score-detail">
    <!-- 专家评分预警详情页 + 学生咨询评分详情页 -->
    <div class="detail-info-item">
      <div class="detail-info-item-title">评分：</div>
      <div class="detail-info-item-content">{{scoreInfo.score + '分'}}</div>
    </div>
    <div class="detail-info-item">
      <div class="detail-info-item-title">评分者：</div>
      <div class="detail-info-item-content">{{scoreInfo.name || scoreInfo.nickName}}</div>
    </div>
    <div class="detail-info-item">
      <div class="detail-info-item-title">评分时间：</div>
      <div class="detail-info-item-content">{{scoreInfo.createTime}}</div>
    </div>
    <div class="detail-info-item" v-if="scoreType === 'student'">
      <div class="detail-info-item-title">状况阐述：</div>
      <div class="detail-info-item-content">{{scoreInfo.reason}}</div>
    </div>
  </section>
</template>
<script>
import ZanField from '@/components/zan/field'
import api from '@/api'
export default {
  components: {
    ZanField
  },
  data () {
    return {
      userType: '',
      id: '',
      scoreType: '',
      scoreInfo: {}
    }
  },
  methods: {
    async getScoreInfo () {
      // 获取评分信息：
      await api.score.getScoreInfo({
        id: this.id,
        scoreType: this.scoreType
      }).then(res => {
        this.scoreInfo = res || []
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.scoreInfo = {
        createTime: '2019-10-10 10:00',
        type: '',
        score: 3.0,
        name: '王一舟',
        nickName: '京东方卡拉夫',
        reason: '艰苦奋斗举案说法据了解撒风口浪尖斯科拉飞机考虑是否进度款类似飞机阿卡丽房价快速拉加福禄寿的开始放假的老师姐夫'
      }
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.scoreType = options.scoreType // 'expert' 专家咨询评分   'student' 学生状况评分
    this.id = options.id
  },
  mounted () {
    let title = this.userType === '1' ? '学生心理状况评分' : '专家咨询评分'
    wx.setNavigationBarTitle({
      title
    })
    this.getScoreInfo()
  }
}
</script>
<style lang="less">
  .page-score-detail {
    background: #fff;
    height: 100%;
    padding: 10px;
    .detail-info-item {
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
      .detail-info-item-title {
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        font-weight: border;
        width: 80px;
        text-align: right;
      }
      .detail-info-item-content {
        border-radius: 5px;
        flex: 1;
        font-size: 14px;
        max-height: 400px;
        background:rgb(248, 244, 244);
        padding: 10px;
        color: rgb(141, 139, 139);
        overflow: auto;
      }
    }
  }
</style>
