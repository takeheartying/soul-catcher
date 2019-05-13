<template>
  <section class="page-score-detail">
    <!-- 专家评分预警详情页 + (学生 | 家长)咨询评分详情页 -->
    <div class="page-score-detail--item"  v-for="(item, index) in scoreInfo" :key="index">
      <div class="detail-info-item">
        <div class="detail-info-item-title">{{item.userType === '1' ? '学生' : (item.userType === '2' ? '专家' : '家长')}}评分：</div>
        <div class="detail-info-item-content">{{item.score > 0 ? (item.score + '分') : '暂无'}}</div>
      </div>
      <div class="detail-info-item">
        <div class="detail-info-item-title">评分者：</div>
        <div class="detail-info-item-content">{{item.name || item.nickName}}</div>
      </div>
      <div class="detail-info-item">
        <div class="detail-info-item-title">评分时间：</div>
        <div class="detail-info-item-content">{{item.createTime}}</div>
      </div>
      <div class="detail-info-item" v-if="scoreType === 'student'">
        <div class="detail-info-item-title">状况阐述：</div>
        <div class="detail-info-item-content">{{item.reason}}</div>
      </div>
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
      scoreInfo: []
    }
  },
  methods: {
    async getScoreInfo () {
      // 获取评分信息：
      await api.score.getConsultScoreInfo({
        userId: this.id, // 被评分者id
        consultId: this.consultId // 咨询室id
      }).then(res => {
        this.scoreInfo = res || []
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.scoreInfo = [
        {
          createTime: '2019-10-10 10:00',
          userType: '2',
          score: 3.0,
          name: '王一舟',
          nickName: '京东方卡拉夫',
          reason: '艰苦奋斗举案说法据了解撒风口浪尖斯科拉飞机考虑是否进度款类似飞机阿卡丽房价快速拉加福禄寿的开始放假的老师姐夫'
        },
        {
          createTime: '2019-10-10 10:00',
          userType: '3',
          score: 9.0,
          name: '成家长',
          nickName: '健康萨芬的放大看反馈'
        }
      ]
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.scoreType = options.scoreType // 'expert' 专家咨询评分   'student' 学生状况评分
    this.id = options.id // 被评分者id
    this.consultId = options.consultId // 咨询室id
  },
  mounted () {
    let title = this.userType === '2' ? '专家咨询评分' : '学生心理状况评分'
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
    .page-score-detail--item {
      margin-bottom: 40px;
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
  }
</style>
