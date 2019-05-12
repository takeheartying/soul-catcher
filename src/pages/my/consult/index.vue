<template>
  <section class="page-my-consult-list">
    <ul class="list-container" v-if="consultList.length">
      <li class="list-item" v-for="(consult, index) in consultList" :key="index">
        <consult-info-card :consultInfo="consult"></consult-info-card>
      </li>
    </ul>
    <g-noresult v-if="!consultList.length" :show="!loading"
    :message="'还没有任何咨询~'"
    :btn="noresultBtn">
    </g-noresult>
  </section>
</template>
<script>
import api from '@/api'
import GNoresult from '@/components/g-noresult/index.vue'
import GLoading from '@/components/g-loading/index.vue'
import ConsultInfoCard from './components/consult-info-card.vue'

export default {
  data () {
    return {
      loading: false,
      consultList: [],
      userType: '1', // 0 管理员 1 学生 2 专家 3 家长
      noresultBtn: {
        content: '去咨询',
        url: '/pages/cosult/list'
      }
    }
  },
  components: {
    GNoresult,
    GLoading,
    ConsultInfoCard
  },
  onLoad (options) {
    this.userType = options.userType || '1'
  },
  methods: {
    async getMyConsultList () {
      await api.my.getConsultList({
        userType: this.userType || '1'
      }).then(res => {
        this.consultList = res || {}
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.consultList = [
        {
          id: '1111111', // 咨询id
          consultorId: '2344234', // 咨询者id
          name: '王灿灿',
          avatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
          authorAcademicTitle: '心理老师',
          tagList: ['爱情脱单', '智商情商', '趣味性格', '心理综合'],
          consultScore: '9.0',
          consultTime: '2019-03-20 16:30'
        },
        {
          id: '222222',
          consultorId: '2344234', // 咨询者id
          name: '何方',
          avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
          authorAcademicTitle: '心理老师',
          tagList: ['爱情脱单', '心理综合'],
          consultScore: '3.5',
          consultTime: '2019-03-21 12:30'
        }
      ]
    }
  },
  mounted () {
    wx._this = this
    wx.setNavigationBarTitle({
      title: '我的咨询'
    })
    this.getMyConsultList()
  }

}
</script>

<style lang="less">
@import '~@/styles/functions.less';
.page-my-consult-list {
  height: 100%;
  background: #fff;
}
</style>
