<template>
  <section class="page-consult-home">
    <!-- 咨询首页 -->
    <div class="consult-contanier">
      <div class="banner">
        <image class="banner-img" mode="aspectFill" src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3573628723,3736684794&fm=11&gp=0.jpg"></image>
      </div>
      <ul class="consult-classification">
        <navigator class="consult-classification-item-navigator first" url="/pages/consult/list/main?tagType=1">
          <li class="consult-classification-item">爱情<br/>脱单</li>
        </navigator>
        <navigator class="consult-classification-item-navigator second" url="/pages/consult/list/main?tagType=2">
          <li class="consult-classification-item">智商<br/>情商</li>
        </navigator>
        <navigator class="consult-classification-item-navigator third" url="/pages/consult/list/main?tagType=3">
          <li class="consult-classification-item">趣味<br/>性格</li>
        </navigator>
        <navigator class="consult-classification-item-navigator forth" url="/pages/consult/list/main?tagType=4">
          <li class="consult-classification-item">心理<br/>综合</li>
        </navigator>
      </ul>
      <!-- 人气专家： -->
      <div class="recommend-list" v-if="recConsultList && recConsultList.length">
        <div class="list-container-top-title">
          <p class="list-container-title">人气专家</p>
          <navigator url="/pages/consult/list/main"><span class="list-container-show-more">查看更多></span></navigator>
        </div>
        <ul class="list-container-items">
          <consult-info-card  v-for="(consult, index) in recConsultList" :key="index" :consultInfo="consult"></consult-info-card>
        </ul>
      </div>
      <!-- 关注的专家： -->
      <div class="recommend-list" v-if="focusConsultList && focusConsultList.length">
        <div class="list-container-top-title">
          <p class="list-container-title">关注专家</p>
          <navigator url="/pages/consult/list/main"><span class="list-container-show-more">查看更多></span></navigator>
        </div>
        <ul class="list-container-items">
          <consult-info-card  v-for="(consult, index) in focusConsultList" :key="index" :consultInfo="consult"></consult-info-card>
        </ul>
      </div>
    </div>
    <tab-bar :userType="userType" v-if="userType" :curUrl="'/pages/consult/home/main'"></tab-bar>
  </section>
</template>
<script>
import tabBar from '@/components/tab-bar'
import consultInfoCard from './components/consult-info-card.vue'
import api from '@/api'
export default {
  data () {
    return {
      userType: '',
      recConsultList: [], // 人气专家列表
      focusConsultList: [] // 关注专家列表
    }
  },
  methods: {
    async getConsultList () {
      // 获取人气专家列表：
      await api.consult.getConsultList({
        pageSize: 5,
        pageNo: 1,
        searchType: 'consultDesc' // 咨询降序
      }).then(res => {
        this.recConsultList = res || {}
      }).catch(err => {
        console.log(err)
      })
      // 获取关注专家列表
      await api.consult.getConsultList({
        pageSize: 5,
        pageNo: 1,
        searchType: 'follow'
      }).then(res => {
        this.focusConsultList = res || {}
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.focusConsultList = this.recConsultList = [
        {
          id: '1111111',
          name: '王灿灿',
          avatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
          authorAcademicTitle: '心理老师',
          tagList: ['爱情脱单', '智商情商', '趣味性格', '心理综合'],
          AverageScore: '9.0',
          consultorNum: 20
        },
        {
          id: '222222',
          name: '何方',
          avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
          authorAcademicTitle: '心理老师',
          tagList: ['爱情脱单', '心理综合'],
          AverageScore: '3.5',
          consultorNum: 9000
        },
        {
          id: '33333',
          name: '玩的翻译',
          avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
          authorAcademicTitle: '心理老师',
          tagList: ['爱情脱单', '心理综合'],
          AverageScore: '3.5',
          consultorNum: 9
        }
      ]
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    if (this.userType && this.userType !== '0') { // userType: '1', // 0 管理员 1 学生 2 专家 3 家长
      wx.hideTabBar() // 显示自定义tabTab
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '心理咨询'
    })
    this.getConsultList()
  },
  components: {
    tabBar,
    consultInfoCard
  }
}
</script>

<style lang="less">
.page-consult-home {
  background: #fff;
  .consult-contanier {
    padding: 0 8px;
    .banner {
      height: 150px;
      .banner-img {
        border-radius: 8px;
        height: 150px;
        width: 100%;
      }
    }
    .consult-classification {
      padding: 15px 0 0 0;
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      .consult-classification-item-navigator {
        height: 50px;
        border-radius: 8px;
        box-shadow: 0 0 5px rgb(179, 177, 177);
        width: 55px;
        .consult-classification-item {
          height: 50px;
          color: #fff;
          line-height: 22.5px;
          text-align: center;
          padding-top: 2px;
          font-size: 14px;

        }
        &.first {
          background: rgb(245, 197, 197);
        }
        &.second {
          background: rgb(252, 211, 107);
        }
        &.third {
          background: rgb(245, 157, 240);
        }
        &.forth {
          background: rgb(218, 210, 252);
        }
      }
    }
    .recommend-list {
      padding: 10px 10px 0 10px;
      .list-container-top-title {
        padding: 0px 3px 10px 0px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .list-container-title {
          font-weight: bolder;
          font-size: 18px;
          width: auto;
        }
        .list-container-show-more {
          position: relative;
          top: 3px;
        }
      }
      .list-container-items {
        height: 175px;
        padding-left: 10px;
        align-items: center;
        display: flex;
        flex-direction: row;
        overflow-x: auto;
        &::-webkit-scrollbar {
          display:none
        }
        .consult-home-info-card:last-child {
          margin-right: 10px !important;
        }
      }
    }
  }
}
</style>
