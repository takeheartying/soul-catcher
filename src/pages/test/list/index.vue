<template>
  <section class="page-test-list">
    <!-- 测试列表页： -->
    <scroll-view  class="page-my-comment--scroll-view"  scroll-y @scrolltolower="bindDownLoad" lower-threshold="100">
      <ul class="list-container" v-if="testList.length">
        <li class="list-item" v-for="(test, index) in testList" :key="index">
          <test-info-card :testInfo="test" :showType="showType" :studentId="studentId"></test-info-card>
        </li>
      </ul>
      <g-loading :loading="loading"></g-loading>
      <g-noresult v-if="!testList.length" :show="!loading"
      :message="'还没有任何测试~'">
      </g-noresult>
    </scroll-view>
  </section>
</template>
<script>
import api from '@/api'
import GNoresult from '@/components/g-noresult/index.vue'
import GLoading from '@/components/g-loading/index.vue'
import TestInfoCard from '../components/test-info-card.vue'

export default {
  data () {
    return {
      showType: '',
      studentId: '', // 学生Id,查询学生所做测试题
      tagTypeDesc: '', // 测试类型
      loading: false,
      finished: false,
      pageNo: 1,
      testList: [],
      userType: '1' // 0 管理员 1 学生 2 专家 3 家长
    }
  },
  components: {
    GNoresult,
    GLoading,
    TestInfoCard
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    switch (options.tagType) { // 测试类型
      case '1':
        this.tagTypeDesc = '爱情脱单'
        break
      case '2':
        this.tagTypeDesc = '智商情商'
        break
      case '3':
        this.tagTypeDesc = '趣味性格'
        break
      case '4':
        this.tagTypeDesc = '心理综合'
        break
      default:
        this.tagTypeDesc = ''
        break
    }
    this.showType = options.showType || '' // 展示类型： 'result' 'test / 空'【默认】
    this.studentId = options.studentId || '' // 查询该学生的测试集
  },
  methods: {
    async getTestList () {
      // 获取测试列表：
      this.loading = true
      this.finished = false
      await api.test.getTestList({
        pageSize: 5,
        pageNo: this.pageNo,
        studentId: this.studentId || ''
      }).then(res => {
        this.testList = res || []
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      let res = {
        pageSize: 5,
        pageNo: 1,
        pageCount: 3,
        items: [
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
      this.testList = this.testList.concat(res.items)
      this.finished = (res.pageCount && this.pageNo >= res.pageCount)

      this.loading = false
    },
    bindDownLoad () { // 上拉加载
      if (!this.finished) {
        this.pageNo++
        this.getTestList()
      }
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: this.tagTypeDesc + '测试列表'
    })
    this.getTestList()
  }

}
</script>

<style lang="less">
@import '~@/styles/functions.less';
.page-test-list {
    height:100%;
    background: #fff;
    padding-bottom: 20px;
    display: flex;
    .page-my-comment--scroll-view {
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
