<template>
  <section class="page-my-test-list">
    <ul class="list-container" v-if="testList.length">
      <li class="list-item" v-for="(test, index) in testList" :key="index">
        <test-info-card :testInfo="test"></test-info-card>
      </li>
    </ul>
    <g-noresult v-if="!testList.length" :show="!loading"
    :message="'还没有任何测试~'"
    :btn="noresultBtn">
    </g-noresult>
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
      testList: [],
      userType: '1', // 0 管理员 1 学生 2 专家 3 家长
      noresultBtn: {
        content: '去测试',
        url: '/pages/test/list'
      }
    }
  },
  components: {
    GNoresult,
    GLoading,
    TestInfoCard
  },
  onLoad (options) {
    this.userType = options.userType || '1'
  },
  methods: {
    async getMyTestList () {
      await api.my.getTestList({
        userType: this.userType || '1'
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
          type: '心理综合',
          testNum: 111,
          id: '111'
        },
        {
          picUrl: 'http://img5.imgtn.bdimg.com/it/u=2011373020,3359872499&fm=26&gp=0.jpg',
          title: '心理健康素养十条',
          desc: '今年的主题是“健康心理，快乐人生',
          type: '心理综合',
          testNum: 3,
          id: '111'
        },
        {
          picUrl: 'http://img2.imgtn.bdimg.com/it/u=2639384659,4031296781&fm=26&gp=0.jpg',
          title: '性格与情感',
          desc: '人的性格不同是因为人的思维方式不同。一个人思维方式的形成，有来自诸多方面的影响。',
          type: '趣味性格',
          testNum: 904,
          id: '39'
        },
        {
          picUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1303936544,1637883161&fm=26&gp=0.jpg',
          title: '原来是爱情',
          desc: '感情不是兔子，守株是没用的',
          type: '爱情脱单',
          testNum: 3004,
          id: '111'
        },
        {
          picUrl: 'http://img4.imgtn.bdimg.com/it/u=1019369127,2450633653&fm=26&gp=0.jpg',
          title: '决定你上限的，不是智商，而是自律',
          desc: '人生如苦旅，有时候决定我们上限的，不是智商，而是自律。',
          type: '智商情商',
          testNum: 21,
          id: '111'
        }
      ]
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '我的测试'
    })
    this.getMyTestList()
  }

}
</script>

<style lang="less">
@import '~@/styles/functions.less';
.page-my-test-list {
  height: 100%;
  background: #fff;
}
</style>
