<template>
  <!-- 我的测试结果列表： -->
  <section class="page-my-test-list">
    <scroll-view  class="page-my-test-list--scroll-view"  scroll-y @scrolltolower="bindDownLoad" lower-threshold="100">
      <ul class="list-container" v-if="testList.length">
        <li class="list-item" v-for="(testResult, index) in testList" :key="index">
          <test-info-card :testInfo="testResult.test" :testResultId="testResult._id"></test-info-card>
        </li>
      </ul>
      <g-loading :loading="loading"></g-loading>
      <g-noresult v-if="!testList.length" :show="!testList.length && !loading"
      :message="'还没有任何测试~'"
      :btn="noresultBtn">
      </g-noresult>
    </scroll-view>
  </section>
</template>
<script>
import api from '@/api'
import GNoresult from '@/components/g-noresult/index.vue'
import GLoading from '@/components/g-loading/index.vue'
import TestInfoCard from './components/test-info-card.vue'

export default {
  data () {
    return {
      loading: false,
      finished: false,
      pageNo: 1,
      testList: [],
      userType: '', // 0 管理员 1 学生 2 专家 3 家长
      noresultBtn: {
        content: '去测试',
        url: '/pages/test/list/main'
      }
    }
  },
  components: {
    GNoresult,
    GLoading,
    TestInfoCard
  },
  onUnload () {
    // 解决页面返回后，数据没重置的问题
    Object.assign(this.$data, this.$options.data())
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.getMyTestList()
  },
  methods: {
    async getMyTestList () {
      this.loading = true
      this.finished = false
      await api.test.getTestResultList({
        userId: this.$app.globalData.userInfo.userId,
        pageSize: 10,
        pageNo: this.pageNo,
        searchType: 'newTime' // 按时间排序
      }).then(res => {
        if (res && res.data && res.data.data) {
          this.testList = this.testList.concat(res.data.data)
          this.finished = res.data.finished
        } else if (res && res.code === '-1') {
          this.$toast(res.message || '系统错误！')
          this.finished = true
        } else {
          this.finished = true
        }
      }).catch(err => {
        console.log(err)
        this.finished = true
      })
      // mock数据：
      // this.testList = [
      //   {
      //     picUrl: 'http://img3.imgtn.bdimg.com/it/u=2870322368,453611869&fm=26&gp=0.jpg',
      //     title: '从积极心理学到幸福感',
      //     desc: '心境由心而设，态度可以决定我们的生活',
      //     tagType: '心理综合',
      //     testorNum: 111,
      //     _id: '111'
      //   },
      //   {
      //     picUrl: 'http://img5.imgtn.bdimg.com/it/u=2011373020,3359872499&fm=26&gp=0.jpg',
      //     title: '心理健康素养十条',
      //     desc: '今年的主题是“健康心理，快乐人生',
      //     tagType: '心理综合',
      //     testorNum: 3,
      //     _id: '111'
      //   },
      //   {
      //     picUrl: 'http://img2.imgtn.bdimg.com/it/u=2639384659,4031296781&fm=26&gp=0.jpg',
      //     title: '性格与情感',
      //     desc: '人的性格不同是因为人的思维方式不同。一个人思维方式的形成，有来自诸多方面的影响。',
      //     tagType: '趣味性格',
      //     testorNum: 904,
      //     _id: '39'
      //   },
      //   {
      //     picUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1303936544,1637883161&fm=26&gp=0.jpg',
      //     title: '原来是爱情',
      //     desc: '感情不是兔子，守株是没用的',
      //     tagType: '爱情脱单',
      //     testorNum: 3004,
      //     _id: '111'
      //   },
      //   {
      //     picUrl: 'http://img4.imgtn.bdimg.com/it/u=1019369127,2450633653&fm=26&gp=0.jpg',
      //     title: '决定你上限的，不是智商，而是自律',
      //     desc: '人生如苦旅，有时候决定我们上限的，不是智商，而是自律。',
      //     tagType: '智商情商',
      //     testorNum: 21,
      //     _id: '111'
      //   }
      // ]
      this.loading = false
    },
    bindDownLoad () { // 上拉加载
      if (!this.finished) {
        this.pageNo++
        this.getMyTestList()
      }
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '我的测试'
    })
  }

}
</script>

<style lang="less">
@import '~@/styles/functions.less';
.page-my-test-list {
  height:100%;
  background: #fff;
  padding-bottom: 20px;
  display: flex;
  .page-my-test-list--scroll-view {
    flex: 1;
    /*隐藏滚动条*/
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
  }
}
</style>
