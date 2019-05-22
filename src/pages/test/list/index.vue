<template>
  <section class="page-test-list">
    <!-- 测试列表页： -->
    <scroll-view  class="page-test-list--scroll-view"  scroll-y @scrolltolower="bindDownLoad" lower-threshold="100">
      <ul class="list-container" v-if="testList.length">
        <li class="list-item" v-for="(test, index) in testList" :key="index">
          <test-info-card :testInfo="test" :showType="showType" :studentId="studentId"></test-info-card>
        </li>
      </ul>
      <!-- 管理员管理测试题 --- 添加测试题按钮： -->
      <div class="page-test-list--add-wrap" v-if="userType === '0'" @click="addTest()">
        <i class="iconfont icon-tianjia"></i>
      </div>
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
  onUnload () {
    // 解决页面返回后，数据没重置的问题
    Object.assign(this.$data, this.$options.data())
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.userType = this.$app.globalData.userType || ''
    this.tagType = options.tagType
    switch (this.tagType) { // 测试类型
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
    // 初始置空：
    this.testList = []
    this.finished = false
    this.pageNo = 1
    this.getTestList()
  },
  methods: {
    async getTestList () {
      // 获取测试列表：
      this.loading = true
      this.finished = false
      await api.test.getTestList({
        tagType: this.tagType || '',
        pageSize: 10,
        pageNo: this.pageNo,
        studentId: this.studentId || ''
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
        this.finished = false
        console.log(err)
        this.$toast('系统错误！')
      })

      this.loading = false
    },
    bindDownLoad () { // 上拉加载
      if (!this.finished) {
        this.pageNo++
        this.getTestList()
      }
    },
    addTest () { // 添加测试题
      wx.navigateTo({url: '/pages/test/edit/main'})
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: this.tagTypeDesc + '测试列表'
    })
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
  .page-test-list--scroll-view {
    flex: 1;
    /*隐藏滚动条*/
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
    .page-test-list--add-wrap {
      position: absolute;
      bottom: 100px;
      right: 40px;
      .iconfont {
        display: block;
        font-size: 50px;
        color: #63B8FF;
        border-radius: 50%;
      }
    }
  }
}
</style>
