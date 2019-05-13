<template>
  <section class="page-homepage-knowledge-base">
    <swiper class="swiper" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
      <block v-for="(item, index) in bannerList" :key="index">
          <swiper-item>
              <image :src="item.imgUrl" class="slide-image"  mode="aspectFill"/>
          </swiper-item>
      </block>
    </swiper>
    <div class="classification-container">
      <navigator class="classfication-item" url="/pages/knowledge/list/main?tagType=1">
        <i class="icon-pic iconfont icon-aiqingyulangman-"></i>
        <i class="icon-name">爱情脱单</i>
      </navigator>
      <navigator class="classfication-item" url="/pages/knowledge/list/main?tagType=2">
        <i class="icon-pic iconfont icon-keailinian"></i>
        <i class="icon-name">智商情商</i>
      </navigator>
      <navigator class="classfication-item" url="/pages/knowledge/list/main?tagType=3">
        <i class="icon-pic iconfont icon-kaituozhequshi"></i>
        <i class="icon-name">趣味性格</i>
      </navigator>
      <navigator class="classfication-item" url="/pages/knowledge/list/main?tagType=4">
        <i class="icon-pic iconfont icon-xinlifenxi"></i>
        <i class="icon-name">心理综合</i>
      </navigator>
    </div>
    <div class="daily-recommend-container">
      <div class="left-part">
        <div>每日</div>
        <div>推荐</div>
        <button class="btn-go">></button>
      </div>
      <div class="right-part">
        <swiper class="swiper" :indicator-dots="false" :display-multiple-items="1"  autoplay="true" interval="4000" duration="1000"
          circular="true">
          <block v-for="(item, index) in recommendList" :key="index">
              <swiper-item class="swiper-item">
                <knowledge-article-card :knowledge="item"></knowledge-article-card>
              </swiper-item>
          </block>
        </swiper>
      </div>
    </div>
    <div class="list-container" v-if="hotArticleList && hotArticleList.length">
      <div class="list-container-top-title">
        <p class="list-container-title">热门文章</p>
        <span class="list-container-show-more" @click="showMore('article')">查看更多></span>
      </div>
      <ul class="list-container-ul">
        <li class="list-container-item"
          v-for="(article, index) in hotArticleList" :key="index" >
          <knowledge-article-card :knowledge="article"></knowledge-article-card>
        </li>
      </ul>
    </div>
    <div class="list-container" v-if="hotVedioList && hotVedioList.length">
      <div class="list-container-top-title">
        <p class="list-container-title">热门视频</p>
        <span class="list-container-show-more" @click="showMore('vedio')">查看更多></span>
      </div>
      <ul class="list-container-ul">
        <li class="list-container-item"
          v-for="(vedio, index) in hotVedioList" :key="index" >
          <knowledge-vedio-card :knowledge="vedio"></knowledge-vedio-card>
        </li>
      </ul>
    </div>
    <tab-bar :userType="userType" v-if="userType"></tab-bar>
  </section>
</template>

<script>
import api from '@/api'
import knowledgeArticleCard from './components/knowledge-article-card'
import knowledgeVedioCard from './components/knowledge-vedio-card'
import tabBar from '@/components/tab-bar'

export default {
  data () {
    return {
      userType: '',
      bannerList: [
        {
          id: '',
          name: 'banner1',
          imgUrl: 'http://img95.699pic.com/photo/50090/0087.jpg_wh300.jpg'
        },
        {
          id: '',
          name: 'banner2',
          imgUrl: 'http://img95.699pic.com/photo/50058/7625.jpg_wh300.jpg'
        },
        {
          id: '',
          name: 'banner3',
          imgUrl: 'http://img95.699pic.com/photo/50106/4305.jpg_wh300.jpg'
        }
      ],
      recommendList: [
        {
          picUrl: 'http://img1.imgtn.bdimg.com/it/u=225858054,3626351077&fm=26&gp=0.jpg',
          title: '恋爱指南',
          desc: '你的恋爱秘籍是？',
          tagType: '爱情脱单',
          id: '111'
        },
        {
          picUrl: 'http://img3.imgtn.bdimg.com/it/u=3284983667,2856592112&fm=26&gp=0.jpg',
          title: '你的人生闪光点是什么？',
          desc: '你最吸引人的闪光点是什么？',
          tagType: '趣味性格',
          id: '222'
        },
        {
          picUrl: 'http://img2.imgtn.bdimg.com/it/u=1817295772,2078737438&fm=26&gp=0.jpg',
          title: '灵魂气味鉴定单',
          desc: '你的灵魂是什么味道的？',
          tagType: '心理综合',
          id: '333'
        }
      ],
      hotArticleList: [
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
      ],
      hotVedioList: []
    }
  },
  components: {
    knowledgeArticleCard,
    knowledgeVedioCard,
    tabBar
  },
  methods: {
    async getInitList () {
      // banner列表：
      let promise1 = api.common.getBannerList().then(res => {
        this.bannerList = res || []
      }).catch(err => {
        console.log(err)
      })
      // 推荐【最新】文章
      let promise2 = api.knowledgeBase.getKnowledgeList({
        knowledgeType: 'article',
        searchType: 'newDesc',
        limit: 3
      }).then(res => {
        this.recommendList = res || []
      }).catch(err => {
        console.log(err)
      })
      // 最热文章
      let promise3 = api.knowledgeBase.getKnowledgeList({
        knowledgeType: 'article',
        searchType: 'hotDesc',
        limit: 5
      }).then(res => {
        this.hotArticleList = res || []
      }).catch(err => {
        console.log(err)
      })
      let promises = [promise1, promise2, promise3]
      await Promise.all(promises)
      // mock数据：在上边
    },
    showMore (knowledgeType) {
      wx.navigateTo({
        url: '/pages/knowledge/list/main?knowledgeType=' + knowledgeType
      })
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    if (this.userType && this.userType !== '0') { // userType: '1', // 0 管理员 1 学生 2 专家 3 家长
      wx.hideTabBar() // 显示自定义tabTab
    }
    this.getInitList()
  }
}
</script>

<style lang="less">
.page-homepage-knowledge-base {
  background: rgb(245, 236, 236);
  .classification-container {
    background: #fff;
    padding: 10px 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .classfication-item {
      margin: 0 auto;
      text-align: center;
      i {
        display: block;
      }
      i.icon-pic.iconfont {
        font-size: 28px;
        margin-bottom: 3px;
      }
      .icon-aiqingyulangman- {
        color: rgb(226, 103, 69);
      }
      .icon-keailinian {
        color: rgb(143, 177, 240);
      }
      .icon-kaituozhequshi {
        color: rgb(236, 142, 186);
      }
      .icon-xinlifenxi {
        color: rgb(241, 69, 16);
      }
      i.icon-name {
        font-size: 14px;
      }
    }
  }
  .daily-recommend-container {
    padding: 8px 10px;
    height: 80px;
    display: flex;
    flex-direction: row;
    .left-part {
      width: 50px;
      margin-right: 6px;
      height: 100%;
      div {
        font-size: 20px;
        line-height: 20px;
        margin-bottom: 10px;
        font-weight: bolder;
        text-align: center;
      }
      button.btn-go {
        font-size: 14px;
        border-radius: 14px;
        color: #fff;
        width: 40px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        background: -webkit-linear-gradient(left,rgb(216, 55, 144),rgb(133, 58, 202), rgb(94, 16, 221));/*for safari5.1-6.0*/
        background: -o-linear-gradient(right,rgb(216, 55, 144), rgb(133, 58, 202), rgb(94, 16, 221));/*Opera 11.1-12.0*/
        background: -moz-linear-gradient(right,rgb(216, 55, 144), rgb(133, 58, 202), rgb(94, 16, 221));/*firefox 3.6-15*/
        background: linear-gradient(to right,rgb(216, 55, 144), rgb(133, 58, 202), rgb(94, 16, 221));/*标准语法*/
      }
    }
    .right-part {
      flex: 1;
      width: calc(100% - 70px);
      height: 100%;
    }
  }
  .list-container {
    margin-bottom: 8px;
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
    .list-container-ul {
      .list-container-item {
        border-bottom: 1px solid #eee;
      }
    }
  }
}
</style>
