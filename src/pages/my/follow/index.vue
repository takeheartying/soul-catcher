<template>
  <section class="page-my-follow-list">
    <!-- 我的关注列表页： -->
    <ul class="list-container" v-if="followList.length">
      <li class="list-item" v-for="(follow, index) in followList" :key="index">
        <follow-info-card :followInfo="follow"></follow-info-card>
      </li>
    </ul>
    <g-loading :loading="loading"></g-loading>
    <g-noresult v-if="!followList.length && !loading" :show="!followList.length && !loading"
    :message="'还没有任何关注~'"
    :btn="noresultBtn">
    </g-noresult>
  </section>
</template>
<script>
import api from '@/api'
import GNoresult from '@/components/g-noresult/index.vue'
import GLoading from '@/components/g-loading/index.vue'
import FollowInfoCard from './components/follow-info-card.vue'

export default {
  data () {
    return {
      loading: false,
      followList: [],
      userType: '1', // 0 管理员 1 学生 2 专家 3 家长
      noresultBtn: {
        content: '去关注',
        url: '/pages/follow/list'
      }
    }
  },
  components: {
    GNoresult,
    GLoading,
    FollowInfoCard
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
  },
  methods: {
    async getMyFollowList () {
      this.loading = true
      await api.my.getFollowList({
        userType: this.userType
      }).then(res => {
        this.followList = res || {}
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.followList = [
        {
          id: '1111111',
          userType: '1',
          name: '王灿灿',
          avatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
          authorAcademicTitle: '心理老师',
          organization: '浙江科技学院',
          tagList: ['爱情脱单', '智商情商', '趣味性格', '心理综合'],
          consultNum: 13, // 咨询数量
          fanNum: 6 // 关注者
        },
        {
          id: '222222',
          name: '何方',
          userType: '2',
          avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
          authorAcademicTitle: '心理老师',
          organization: '浙江工业大学',
          tagList: ['爱情脱单', '心理综合'],
          consultNum: 10, // 咨询数量
          fanNum: 2 // 关注者
        },
        {
          id: '222222',
          name: '方家长',
          userType: '3',
          avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
          authorAcademicTitle: '心理老师',
          organization: '浙江工业大学',
          tagList: ['爱情脱单', '心理综合'],
          consultNum: 10, // 咨询数量
          fanNum: 2
        }
      ]
      this.loading = false
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '我的关注'
    })
    this.getMyFollowList()
  }

}
</script>

<style lang="less">
@import '~@/styles/functions.less';
.page-my-follow-list {
  height: 100%;
  background: #fff;
}
</style>
