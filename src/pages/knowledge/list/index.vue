<template>
  <!-- 知识库列表 -->
  <section class="page-knowledge-list">
    <div class="page-knowledge-list--filter" v-if="!loading && knowledgeList.length">
      <!-- top:筛选条离顶部的距离 -->
      <filter-bar
        ref="filter"
        :top="0"
        :bar-menus="barMenus"
        @changeSelect="changeData">
      </filter-bar>
    </div>
    <scroll-view class="page-knowledge-list--scroll-view"  scroll-y @scrolltolower="bindDownLoad" lower-threshold="100">
      <ul class="page-knowledge-list--items" v-if="knowledgeList && knowledgeList.length">
        <li class="page-knowledge-list--item"
          v-for="(article, index) in knowledgeList" :key="index" >
          <knowledge-article-card :knowledge="article" :showEdit="showEdit"></knowledge-article-card>
        </li>
      </ul>
    </scroll-view>
    <!-- 专家查看我的知识库 || 管理员管理知识库 --- 添加知识库按钮： -->
    <div class="page-knowledge-list--add-wrap" v-if="(userType === '2' && expertId) || userType === '0'" @click="addKnowledge()">
      <i class="iconfont icon-tianjia"></i>
    </div>
    <g-loading ref="loading" :loading="loading"></g-loading>
    <g-noresult
    v-if="!knowledgeList.length && !loading"
    :show="!knowledgeList.length && !loading"
    :knowledge="'还没有任何记录~'">
    </g-noresult>
  </section>
</template>
<script>
import api from '@/api'
import FilterBar from '@/components/g-filter/index.vue'
import GNoresult from '@/components/g-noresult/index.vue'
import GLoading from '@/components/g-loading/index.vue'
import knowledgeArticleCard from '../../home/components/knowledge-article-card'
export default {
  components: {
    FilterBar,
    GNoresult,
    GLoading,
    knowledgeArticleCard
  },
  data () {
    return {
      firstGetData: true, // 第一次获取列表数据
      barMenus: [
        {
          name: '类型筛选', // 按钮名称
          icon: '',
          value: '', // 按钮的默认值
          type: '', // 区分筛选按钮，当type='filter'时，列表为筛选模式。
          showTabHeader: true, // 显示弹框一级目录， 当type='filter'时，其值为false
          defaultIcon: '',
          selectIcon: '',
          selectIndex: 0, // 当type='filter'时，其值为-1
          tabs: [{
            icon: '',
            name: '类型筛选',
            selectIndex: 0,
            detailList: [{ // 二级目录左侧列表数据
              name: '全部',
              icon: '',
              value: '', // 以月为单位 1 3 6 12
              selectIndex: 0
            },
            {
              name: '爱情脱单',
              icon: '',
              value: '1',
              selectIndex: 1
            },
            {
              name: '智商情商',
              icon: '',
              value: '2',
              selectIndex: 2
            },
            {
              name: '趣味性格',
              icon: '',
              value: '3',
              selectIndex: 3
            },
            {
              name: '心理综合',
              icon: '',
              value: '4',
              selectIndex: 4
            }]
          }]
        },
        {
          name: '列表排序',
          icon: '',
          value: '',
          showTabHeader: true,
          defaultIcon: '',
          selectIcon: '',
          selectIndex: 0,
          tabs: [{
            icon: '',
            name: '列表排序',
            selectIndex: 0,
            detailList: [{
              name: '全部',
              icon: '',
              value: '',
              selectIndex: 0
            }, {
              name: '评论数由高到低',
              icon: '',
              value: 'mostComment',
              selectIndex: 1
            }, {
              name: '发表时间由近到远',
              icon: '',
              value: 'newTime',
              selectIndex: 2
            }]
          }]
        }
      ],
      userType: '',
      knowledgeType: 'article', // 当前只设置article
      searchType: '', // 排序类型： 'newTime' 或者 'mostComment'
      tagType: '',
      expertId: '',
      knowledgeList: [],
      loading: false,
      finished: false,
      pageNo: 1,
      showEdit: false
    }
  },
  methods: {
    addKnowledge () { // 添加知识库
      wx.navigateTo({url: '/pages/knowledge/edit/main'})
    },
    changeData (v) { // 返回最终结果。(注：筛选结果的value返回json对象)
      if (v && v.length >= 2 && !this.firstGetData) {
        this.tagType = v[0].value || ''
        this.searchType = v[1].value || '' // 按评论数筛选 或 按时间顺序筛选
        // 重置信息：请求数据
        this.pageNo = 1
        this.finished = false
        this.knowledgeList = []
        this.getKnowledgeList()
      }
      if (this.firstGetData) {
        this.firstGetData = false
      }
    },
    bindDownLoad () {
      if (!this.finished) {
        this.getKnowledgeList()
      }
    },
    async getKnowledgeList () {
      // 获取知识库列表：
      this.loading = true
      this.finished = false
      await api.knowledgeBase.getKnowledgeList({
        expertId: this.expertId,
        tagType: this.tagType,
        knowledgeType: this.knowledgeType || 'article',
        searchType: this.searchType, // newTime: 最新   mostComment: 评论最多
        pageNo: this.pageNo,
        pageSize: 10
      }).then(res => {
        if (res && res.data) {
          this.knowledgeList = this.knowledgeList.concat(res.data)
          this.finished = res.finished
          this.pageNo++
        }
      }).catch(err => {
        console.log(err)
      })

      this.loading = false
    },
    initData () { // 初始清空数据 + 更改filter显示栏
      if (!this.tagType) {
        this.firstGetData = false // 为了初始点击某一个tab的时候可以加载数据
      }
      this.knowledgeList = []
      this.finished = false
      this.pageNo = 1
      this.initFilter()
      this.getKnowledgeList()
    },
    initFilter () {
      let tagIndex = Number(this.tagType)
      let orderIndex = 0
      if (this.searchType === 'mostComment') {
        orderIndex = 1
      } else if (this.searchType === 'newTime') {
        orderIndex = 2
      }
      setTimeout(() => {
        if (this.$refs.filter && this.tagType) {
          this.$refs.filter.handleShowDialog(this.barMenus[0], 0, false, tagIndex)
        }
        if (this.$refs.filter && this.searchType) {
          this.$refs.filter.handleShowDialog(this.barMenus[1], 1, false, orderIndex)
        }
      }, 2000)
    }
  },
  onUnload () {
    // 解决页面返回后，数据没重置的问题
    Object.assign(this.$data, this.$options.data())
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.userType = this.$app.globalData.userType || ''
    this.expertId = options.expertId || '' // 指定专家的知识库列表
    this.tagType = options.tagType || '' // 1 2 3 4
    this.searchType = options.searchType || '' // newTime 或者 mostComment
    this.knowledgeType = options.knowledgeType || 'article' // vedio 或者 article 【目前只做article】
    this.showEdit = (this.userType === '2' && this.expertId) || this.userType === '0' // 专家或管理员查看我的知识库 -- 前往编辑
    this.initData()
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '知识库列表'
    })
  }
}
</script>

<style lang="less">
  @import "~@/styles/functions.less";
  .page-knowledge-list {
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    .page-knowledge-list--scroll-view {
      flex: 1;
      overflow: hidden;
      /*隐藏滚动条*/
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }
      .page-knowledge-list--items {
        .page-knowledge-list--item {
          border-bottom: 0.5px solid #eee;
        }
      }
    }
    .page-knowledge-list--filter{
      height: 40px;
    }
    .page-knowledge-list--add-wrap {
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
</style>

