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
      <div class="classfication-item">
        <i class="icon-pic iconfont icon-aiqingyulangman-"></i>
        <i class="icon-name">爱情脱单</i>
      </div>
      <div class="classfication-item">
        <i class="icon-pic iconfont icon-keailinian"></i>
        <i class="icon-name">智商情商</i>
      </div>
      <div class="classfication-item">
        <i class="icon-pic iconfont icon-kaituozhequshi"></i>
        <i class="icon-name">趣味性格</i>
      </div>
      <div class="classfication-item">
        <i class="icon-pic iconfont icon-xinlifenxi"></i>
        <i class="icon-name">心理综合</i>
      </div>
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
    <div class="list-container">
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
    <div class="list-container">
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
          type: '爱情脱单',
          id: '111'
        },
        {
          picUrl: 'http://img3.imgtn.bdimg.com/it/u=3284983667,2856592112&fm=26&gp=0.jpg',
          title: '你的人生闪光点是什么？',
          desc: '你最吸引人的闪光点是什么？',
          type: '趣味性格',
          id: '222'
        },
        {
          picUrl: 'http://img2.imgtn.bdimg.com/it/u=1817295772,2078737438&fm=26&gp=0.jpg',
          title: '灵魂气味鉴定单',
          desc: '你的灵魂是什么味道的？',
          type: '心理综合',
          id: '333'
        }
      ],
      hotArticleList: [
        {
          picUrl: 'http://img3.imgtn.bdimg.com/it/u=2870322368,453611869&fm=26&gp=0.jpg',
          title: '从积极心理学到幸福感',
          desc: '心境由心而设，态度可以决定我们的生活',
          type: '心理综合',
          id: '111'
        },
        {
          picUrl: 'http://img5.imgtn.bdimg.com/it/u=2011373020,3359872499&fm=26&gp=0.jpg',
          title: '心理健康素养十条',
          desc: '今年的主题是“健康心理，快乐人生',
          type: '心理综合',
          id: '111'
        },
        {
          picUrl: 'http://img2.imgtn.bdimg.com/it/u=2639384659,4031296781&fm=26&gp=0.jpg',
          title: '性格与情感',
          desc: '人的性格不同是因为人的思维方式不同。一个人思维方式的形成，有来自诸多方面的影响。',
          type: '趣味性格',
          id: '111'
        },
        {
          picUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1303936544,1637883161&fm=26&gp=0.jpg',
          title: '原来是爱情',
          desc: '感情不是兔子，守株是没用的',
          type: '爱情脱单',
          id: '111'
        },
        {
          picUrl: 'http://img4.imgtn.bdimg.com/it/u=1019369127,2450633653&fm=26&gp=0.jpg',
          title: '决定你上限的，不是智商，而是自律',
          desc: '人生如苦旅，有时候决定我们上限的，不是智商，而是自律。',
          type: '智商情商',
          id: '111'
        }
      ],
      hotVedioList: [
        {
          picUrl: 'http://img2.imgtn.bdimg.com/it/u=3094257971,4029773707&fm=26&gp=0.jpg',
          url: '//player.video.iqiyi.com/cc60a314a1a0bd54cc4a21b0c0f5e7c3/0/0/w_19rsmbovb9.swf-albumId=2420658409-tvId=2420658409-isPurchase=0-cnId=undefined',
          title: '6个心理学技巧让别人对你有求必应',
          desc: '有求必应不是梦！再也不会被人拒绝了。',
          type: '心理综合',
          id: '111',
          authorName: '王超',
          createTime: '2019-04-03',
          authorAcademicTitle: '心理专家'
        },
        {
          picUrl: 'http://img1.imgtn.bdimg.com/it/u=3077813778,1350733835&fm=26&gp=0.jpg',
          url: 'https://v.qq.com/txp/iframe/player.html?vid=v0742efdt62',
          title: '22个心理学效应',
          desc: '我们知道的都是别人总结出来的书本知识，未曾经过亲身经历，无法触碰心灵，更无法触碰那些早已经僵化的思维模式，所以遇到事情时，我们依旧不由自主的按照原本的习惯行动。 为此，我们从近500个心理学现象里，挑出了21个与我们心灵成长相近、最能帮助我们提高认知，最有可能获得改变力量的心理学效应。',
          type: '心理综合',
          id: '111',
          authorName: '陈珊妮',
          createTime: '2019-04-03',
          authorAcademicTitle: '心理老师'
        },
        {
          picUrl: 'http://img3.imgtn.bdimg.com/it/u=2661824848,1222085723&fm=26&gp=0.jpg',
          url: 'http://aliyun48001.baomihua.com/891d5b6b5dec12ead3e0c0df35438858/5caf5dac/3567/35660618_9_c8552bba1f2d11e5800d001ec9e267e0.mp4',
          title: '我挑战你把整个视频看完',
          desc: 'try!!!',
          type: '心理综合',
          id: '111',
          createTime: '2019-04-03',
          authorName: '柯洁',
          authorAcademicTitle: '心理专家'
        },
        {
          picUrl: 'http://img1.imgtn.bdimg.com/it/u=950890274,2564523623&fm=200&gp=0.jpg',
          url: 'blob:http://player.youku.com/0d26ca66-770c-40c7-beb0-bdd83194802a',
          createTime: '2019-04-03',
          title: '教育心理学',
          desc: '教育心理学让你的生活更美好',
          type: '心理综合',
          id: '111',
          authorName: '周武杰',
          authorAcademicTitle: '心理专家'
        },
        {
          picUrl: 'http://img3.imgtn.bdimg.com/it/u=2902508357,2758515272&fm=26&gp=0.jpg',
          url: '//player.video.iqiyi.com/d89bf9547aef5e1a103b9cbfb339fb89/0/0/v_19rroikhu8.swf-albumId=372170300-tvId=372170300-isPurchase=0-cnId=undefined',
          title: '关注心理健康微视频',
          desc: '关注心理健康，换一生幸福',
          type: '心理综合',
          createTime: '2019-04-03',
          id: '111',
          authorName: '张媛媛',
          authorAcademicTitle: '心理专家'
        }
      ]
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
        type: 'article',
        searchType: 'newDesc',
        limit: 3
      }).then(res => {
        this.recommendList = res || []
      }).catch(err => {
        console.log(err)
      })
      // 最热文章
      let promise3 = api.knowledgeBase.getKnowledgeList({
        type: 'article',
        searchType: 'hotDesc',
        limit: 5
      }).then(res => {
        this.hotArticleList = res || []
      }).catch(err => {
        console.log(err)
      })
      // 最热视频：
      let promise4 = api.knowledgeBase.getKnowledgeList({
        type: 'vedio',
        searchType: 'hotDesc',
        limit: 5
      }).then(res => {
        this.hotVedioList = res || []
      }).catch(err => {
        console.log(err)
      })
      let promises = [promise1, promise2, promise3, promise4]
      await Promise.all(promises)
      // mock数据：在上边
    },
    showMore (type) {
      wx.navigateTo({
        url: '/pages/knowledge/list/main?type=' + type
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
