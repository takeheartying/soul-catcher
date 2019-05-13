<template>
  <!-- 知识库列表 -->
  <section class="page-knowledge-list">
    <div class="page-knowledge-list--filter">
      <!-- top:筛选条离顶部的距离 -->
      <filter-bar
        :top="0"
        :bar-menus="barMenus"
        @changeSelect="changeData">
      </filter-bar>
    </div>
    <scroll-view  class="page-knowledge-list--scroll-view"  scroll-y @scrolltolower="bindDownLoad" lower-threshold="100">
      <ul class="page-knowledge-list--items" v-if="knowledgeList && knowledgeList.length">
        <li class="page-knowledge-list--item"
          v-for="(article, index) in knowledgeList" :key="index" >
          <knowledge-article-card :knowledge="article"></knowledge-article-card>
        </li>
      </ul>
    </scroll-view>
    <g-noresult
    v-if="!knowledgeList.length"
    :show="true"
    :knowledge="'还没有任何记录~'">
    </g-noresult>
  </section>
</template>
<script>
import api from '@/api'
import FilterBar from '@/components/g-filter/index.vue'
import GNoresult from '@/components/g-noresult/index.vue'
import knowledgeArticleCard from '../../home/components/knowledge-article-card'
export default {
  components: {
    FilterBar,
    GNoresult,
    knowledgeArticleCard
  },
  data () {
    return {
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
      pageNo: 1
    }
  },
  methods: {
    changeData (v) { // 返回最终结果。(注：筛选结果的value返回json对象)
      if (v && v.length >= 2) {
        this.tagType = v[0].value || ''
        this.searchType = v[1].value || '' // 按评论数筛选 或 按时间顺序筛选
        // 重置信息：请求数据
        this.pageNo = 1
        this.finished = false
        this.knowledgeList = []
        this.getKnowledgeList()
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
        this.knowledgeList = this.knowledgeList.concat(res.items)
        this.finished = (res.pageCount && this.pageNo >= res.pageCount)
        this.pageNo++
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      let res = {
        pageSize: 10,
        pageNo: 1,
        pageCount: 3,
        totalCount: 15,
        items: [
          {
            picUrl: 'http://img3.imgtn.bdimg.com/it/u=2870322368,453611869&fm=26&gp=0.jpg',
            title: '从积极心理学到幸福感',
            desc: '心境由心而设，态度可以决定我们的生活',
            tagType: '心理综合',
            id: '111'
          },
          {
            picUrl: 'http://img5.imgtn.bdimg.com/it/u=2011373020,3359872499&fm=26&gp=0.jpg',
            title: '心理健康素养十条',
            desc: '今年的主题是“健康心理，快乐人生',
            tagType: '心理综合',
            id: '111'
          },
          {
            picUrl: 'http://img2.imgtn.bdimg.com/it/u=2639384659,4031296781&fm=26&gp=0.jpg',
            title: '性格与情感',
            desc: '人的性格不同是因为人的思维方式不同。一个人思维方式的形成，有来自诸多方面的影响。',
            tagType: '趣味性格',
            id: '111'
          },
          {
            picUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1303936544,1637883161&fm=26&gp=0.jpg',
            title: '原来是爱情',
            desc: '感情不是兔子，守株是没用的',
            tagType: '爱情脱单',
            id: '111'
          },
          {
            picUrl: 'http://img4.imgtn.bdimg.com/it/u=1019369127,2450633653&fm=26&gp=0.jpg',
            title: '决定你上限的，不是智商，而是自律',
            desc: '人生如苦旅，有时候决定我们上限的，不是智商，而是自律。',
            tagType: '智商情商',
            id: '111'
          },
          {
            picUrl: 'http://img3.imgtn.bdimg.com/it/u=2870322368,453611869&fm=26&gp=0.jpg',
            title: '从积极心理学到幸福感',
            desc: '心境由心而设，态度可以决定我们的生活',
            tagType: '心理综合',
            id: '111'
          },
          {
            picUrl: 'http://img5.imgtn.bdimg.com/it/u=2011373020,3359872499&fm=26&gp=0.jpg',
            title: '心理健康素养十条',
            desc: '今年的主题是“健康心理，快乐人生',
            tagType: '心理综合',
            id: '111'
          },
          {
            picUrl: 'http://img2.imgtn.bdimg.com/it/u=2639384659,4031296781&fm=26&gp=0.jpg',
            title: '性格与情感',
            desc: '人的性格不同是因为人的思维方式不同。一个人思维方式的形成，有来自诸多方面的影响。',
            tagType: '趣味性格',
            id: '111'
          },
          {
            picUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1303936544,1637883161&fm=26&gp=0.jpg',
            title: '原来是爱情',
            desc: '感情不是兔子，守株是没用的',
            tagType: '爱情脱单',
            id: '111'
          },
          {
            picUrl: 'http://img4.imgtn.bdimg.com/it/u=1019369127,2450633653&fm=26&gp=0.jpg',
            title: '决定你上限的，不是智商，而是自律',
            desc: '人生如苦旅，有时候决定我们上限的，不是智商，而是自律。',
            tagType: '智商情商',
            id: '111'
          }
        ]
      }
      this.knowledgeList = this.knowledgeList.concat(res.items)
      this.finished = (res.pageCount && this.pageNo >= res.pageCount)
      this.pageNo++

      this.loading = false
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.expertId = options.expertId || '' // 指定专家的知识库列表
    this.tagType = options.tagType || '' // 1 2 3 4
    this.searchType = options.searchType || '' // newTime 或者 mostComment
    this.knowledgeType = options.knowledgeType || 'article' // vedio 或者 article 【目前只做article】
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '知识库列表'
    })
    this.getKnowledgeList()
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
  }
</style>

