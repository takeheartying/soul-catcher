<template>
  <section class="page-consult-list">
    <scroll-view  class="page-consult-list--scroll-view"  scroll-y @scrolltolower="bindDownLoad" lower-threshold="100">
      <ul class="list-container" v-if="consultList.length">
        <li class="list-item" v-for="(consult, index) in consultList" :key="index">
          <consult-info-card :consultInfo="consult"></consult-info-card>
        </li>
      </ul>
    </scroll-view>
    <g-noresult v-if="!consultList.length" :show="!loading"
    :message="'还没有任何专家可咨询~'">
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
      finished: false,
      pageNo: 1,
      consultList: [],
      userType: '1', // 0 管理员 1 学生 2 专家 3 家长
      tagType: '' // 标签类型
    }
  },
  components: {
    GNoresult,
    GLoading,
    ConsultInfoCard
  },
  onLoad (options) {
    this.userType = options.userType || '1'
    this.tagType = options.tagType || ''
  },
  methods: {
    async getConsultList () {
      // 获取咨询专家列表：
      this.loading = true
      this.finished = false
      await api.consult.getConsultList({
        userType: this.userType || '1',
        pageSize: 5,
        pageNo: 1,
        tagType: this.type,
        searchType: 'consultDesc' // 咨询降序
      }).then(res => {
        this.consultList = res || {}
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      let res = {
        pageSize: 10,
        pageNo: 1,
        pageCount: 3,
        items: [
          {
            id: '1111111',
            name: '王灿灿',
            nickName: '大会上开发',
            avatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
            authorAcademicTitle: '心理老师',
            tagList: ['爱情脱单', '智商情商', '趣味性格', '心理综合'],
            AverageScore: '9.0',
            isConsulting: false
          },
          {
            id: '1111111',
            name: '王灿灿',
            nickName: '大会上开发',
            avatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
            authorAcademicTitle: '心理老师',
            tagList: ['爱情脱单', '智商情商', '趣味性格', '心理综合'],
            AverageScore: '9.0',
            isConsulting: false
          },
          {
            id: '1111111',
            name: '王灿灿',
            nickName: '大会上开发',
            avatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
            authorAcademicTitle: '心理老师',
            tagList: ['爱情脱单', '智商情商', '趣味性格', '心理综合'],
            AverageScore: '9.0',
            isConsulting: false
          },
          {
            id: '1111111',
            name: '王灿灿',
            nickName: '大会上开发',
            avatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
            authorAcademicTitle: '心理老师',
            tagList: ['爱情脱单', '智商情商', '趣味性格', '心理综合'],
            AverageScore: '9.0',
            isConsulting: false
          },
          {
            id: '222222',
            name: '何方',
            nickName: 'djasfkdjfhkasfj电风扇你就看看',
            avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
            authorAcademicTitle: '心理老师',
            tagList: ['爱情脱单', '心理综合'],
            AverageScore: '3.5',
            isConsulting: true, // 是否今天已经建立了咨询室
            consultId: '33333'
          },
          {
            id: '1111111',
            name: '王灿灿',
            nickName: '大会上开发',
            avatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
            authorAcademicTitle: '心理老师',
            tagList: ['爱情脱单', '智商情商', '趣味性格', '心理综合'],
            AverageScore: '9.0',
            isConsulting: false
          },
          {
            id: '1111111',
            name: '王灿灿',
            nickName: '大会上开发',
            avatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
            authorAcademicTitle: '心理老师',
            tagList: ['爱情脱单', '智商情商', '趣味性格', '心理综合'],
            AverageScore: '9.0',
            isConsulting: false
          },
          {
            id: '1111111',
            name: '王灿灿',
            nickName: '大会上开发',
            avatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
            authorAcademicTitle: '心理老师',
            tagList: ['爱情脱单', '智商情商', '趣味性格', '心理综合'],
            AverageScore: '9.0',
            isConsulting: false
          },
          {
            id: '1111111',
            name: '王灿灿',
            nickName: '大会上开发',
            avatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
            authorAcademicTitle: '心理老师',
            tagList: ['爱情脱单', '智商情商', '趣味性格', '心理综合'],
            AverageScore: '9.0',
            isConsulting: false
          },
          {
            id: '222222',
            name: '何方',
            nickName: 'djasfkdjfhkasfj电风扇你就看看',
            avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
            authorAcademicTitle: '心理老师',
            tagList: ['爱情脱单', '心理综合'],
            AverageScore: '3.5',
            isConsulting: true, // 是否今天已经建立了咨询室
            consultId: '33333'
          }
        ]
      }
      this.loading = false
      this.consultList = this.consultList.concat(res.items)
      this.finished = (res.pageCount && this.pageNo >= res.pageCount)
    },
    bindDownLoad () { // 上拉加载
      if (!this.finished) {
        this.pageNo++
        this.getConsultList()
      }
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '咨询列表'
    })
    this.getConsultList()
  }

}
</script>

<style lang="less">
  @import '~@/styles/functions.less';
  .page-consult-list {
    height:100%;
    background: #fff;
    padding-bottom: 20px;
    display: flex;
    .page-consult-list--scroll-view {
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
