<template>
  <section class="page-test-home">
    <div class="test-container">
      <ul class="test-classification">
        <navigator class="test-classification-item-navigator"  url="/pages/test/list/main?tagType=1">
          <li class="test-classification-item">
            <image class="left-part" mode="aspetFill" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4131402201,1846744217&fm=11&gp=0.jpg"></image>
            <p class="middle-part">爱情脱单测试</p>
            <div class="right-part">
              <i class="iconfont icon-fanhui-copy"></i>
            </div>
          </li>
        </navigator>
        <navigator class="test-classification-item-navigator"  url="/pages/test/list/main?tagType=2">
          <li class="test-classification-item">
            <image class="left-part" mode="aspetFill" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2058245127,2767535828&fm=26&gp=0.jpg"></image>
            <p class="middle-part">智商情商测试</p>
            <div class="right-part">
              <i class="iconfont icon-fanhui-copy"></i>
            </div>
          </li>
        </navigator>
        <navigator class="test-classification-item-navigator"  url="/pages/test/list/main?tagType=3">
          <li class="test-classification-item">
            <image class="left-part" mode="aspetFill" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3203841623,3937599443&fm=11&gp=0.jpg"></image>
            <p class="middle-part">趣味性格测试</p>
            <div class="right-part">
              <i class="iconfont icon-fanhui-copy"></i>
            </div>
          </li>
        </navigator>
        <navigator class="test-classification-item-navigator"  url="/pages/test/list/main?tagType=4">
          <li class="test-classification-item">
            <image class="left-part" mode="aspetFill" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1753670289,1375509139&fm=11&gp=0.jpg"></image>
            <p class="middle-part">心理综合测试</p>
            <div class="right-part">
              <i class="iconfont icon-fanhui-copy"></i>
            </div>
          </li>
        </navigator>
      </ul>
      <g-loading :loading="loading"></g-loading>
      <!-- 测试推荐： -->
      <ul class="recommend-list" v-if="testList.length">
        <div class="list-container-top-title">
          <p class="list-container-title">推荐测试</p>
          <navigator url="/pages/test/list/main"><span class="list-container-show-more">查看更多></span></navigator>
        </div>
        <li class="list-item" v-for="(test, index) in testList" :key="index">
          <test-info-card :testInfo="test"></test-info-card>
        </li>
      </ul>
    </div>
    <tab-bar :userType="userType" v-if="userType" :curUrl="'/pages/test/home/main'"></tab-bar>
  </section>
</template>
<script>
import tabBar from '@/components/tab-bar'
import GLoading from '@/components/g-loading/index.vue'
import TestInfoCard from '../components/test-info-card.vue'
import api from '@/api'
export default {
  data () {
    return {
      loading: false,
      userType: '',
      testList: []
    }
  },
  methods: {
    async getRecommendTestList () {
      this.loading = true
      await api.test.getTestList({
        limit: 5
      }).then(res => {
        this.testList = res || {}
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.testList = [
        {
          picUrl: 'http://img3.imgtn.bdimg.com/it/u=2870322368,453611869&fm=26&gp=0.jpg',
          title: '从积极心理学到幸福感',
          desc: '心境由心而设，态度可以决定我们的生活',
          tagType: '心理综合',
          testorNum: 111,
          id: '111'
        },
        {
          picUrl: 'http://img5.imgtn.bdimg.com/it/u=2011373020,3359872499&fm=26&gp=0.jpg',
          title: '心理健康素养十条',
          desc: '今年的主题是“健康心理，快乐人生',
          tagType: '心理综合',
          testorNum: 3,
          id: '111'
        },
        {
          picUrl: 'http://img2.imgtn.bdimg.com/it/u=2639384659,4031296781&fm=26&gp=0.jpg',
          title: '性格与情感',
          desc: '人的性格不同是因为人的思维方式不同。一个人思维方式的形成，有来自诸多方面的影响。',
          tagType: '趣味性格',
          testorNum: 904,
          id: '39'
        },
        {
          picUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1303936544,1637883161&fm=26&gp=0.jpg',
          title: '原来是爱情',
          desc: '感情不是兔子，守株是没用的',
          tagType: '爱情脱单',
          testorNum: 3004,
          id: '111'
        },
        {
          picUrl: 'http://img4.imgtn.bdimg.com/it/u=1019369127,2450633653&fm=26&gp=0.jpg',
          title: '决定你上限的，不是智商，而是自律',
          desc: '人生如苦旅，有时候决定我们上限的，不是智商，而是自律。',
          tagType: '智商情商',
          testorNum: 21,
          id: '111'
        }
      ]
      this.loading = false
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
      title: '心理测试'
    })
    this.getRecommendTestList()
  },
  components: {
    tabBar,
    TestInfoCard,
    GLoading
  }
}
</script>

<style lang="less">
.page-test-home {
  .test-container {
    .test-classification {
      margin-bottom: 15px;
      .test-classification-item-navigator {
        background: #fff;
        margin: 15px 10px 0 10px;
        display: block;
        border-radius: 8px;
        height: 60px;
        padding: 10px 30px;
        box-shadow: 0 0 8px rgba(73, 72, 72, 0.5);
        .test-classification-item {
          line-height: 60px;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
        }
        .left-part {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-right: 20px;
        }
        .middle-part {
          font-size: 16px;
          flex: 1;
        }
        .right-part {
          width: 20px;
          .icon-fanhui-copy {
            font-size: 24px;
            color: rgb(196, 191, 191);
          }
        }
      }
    }
    .recommend-list {
      border-radius: 8px;
      margin: 0 10px 8px 10px;
      background: #fff;
      .list-container-top-title {
        padding: 8px 12px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .list-container-title {
          font-weight: bolder;
          font-size: 18px;
          width: auto;
          height: 20px;
        }
        .list-container-show-more {
          margin-top:4px;
        }
      }
    }
  }
}
</style>
