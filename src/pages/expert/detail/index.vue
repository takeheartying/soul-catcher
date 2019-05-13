<template>
  <div class="page-expert-detail" :style="expertInfo.id ? '' : 'height:100%;'">
    <!-- 专家主页详情 -->
    <div class="page-expert-detail--container" v-if="expertInfo && expertInfo.id">
      <div class="expert-info-top">
        <image class="expert-info-top-avatar" mode="aspectFill" :src="expertInfo.avatar"></image>
        <div class="expert-info-top-name">{{expertInfo.name || expertInfo.nickName}}</div>
        <div class="expert-info-top-academic-title">{{expertInfo.academicTitle}}</div>
      </div>
      <div class="expert-info-middle">
        <div :class="curTab === 'home' ? 'expert-info-middle-tab active' : 'expert-info-middle-tab'" @click="switchTab('home')">主页</div>
        <div :class="curTab !== 'home' ? 'expert-info-middle-tab active' : 'expert-info-middle-tab'" @click="switchTab('knowledge')">知识库</div>
      </div>
      <div class="tab-home" v-if="curTab === 'home'">
        <div class="expert-info-bottom">
          <ul class="expert-info-bottom-statistic">
            <li class="expert-info-bottom-statistic-item">
              <div class="item-num">{{expertInfo.consultorNum}}</div>
              <div class="item-unit">人咨询</div>
            </li>
            <span class="expert-info-bottom-statistic-item-split"></span>
            <li class="expert-info-bottom-statistic-item">
              <div class="item-num">{{expertInfo.averageScore}}</div>
              <div class="item-unit">评价分</div>
            </li>
            <span class="expert-info-bottom-statistic-item-split"></span>
           <li class="expert-info-bottom-statistic-item">
              <div class="item-num">{{expertInfo.knowledgeNum}}</div>
              <div class="item-unit">部作品</div>
            </li>
            <span class="expert-info-bottom-statistic-item-split"></span>
            <li class="expert-info-bottom-statistic-item">
              <div class="item-num">{{expertInfo.fanNum}}</div>
              <div class="item-unit">人关注</div>
            </li>
          </ul>
          <ul class="expert-info-bottom-info">
            <li class="expert-info-bottom-info-item">
              <div class="item-title">详细介绍：</div>
              <div class="item-content">{{expertInfo.desc}}</div>
            </li>
            <li class="expert-info-bottom-info-item">
              <div class="item-title">擅长领域：</div>
              <div class="item-content">
                <span v-for="(tag, index) in expertInfo.tagList" :key="index">{{tag}}</span>
              </div>
            </li>
            <li class="expert-info-bottom-info-item">
              <div class="item-title">工作单位：</div>
              <div class="item-content">{{expertInfo.organization}}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="tab-knowledge" v-if="curTab === 'knowledge'">
        <div class="knowledge-title">总数【{{expertInfo.knowledgeNum}}】</div>
        <ul class="knowledge-list">
          <li class="knowledge-list-item"
            v-for="(article, index) in expertInfo.knowledgeList" :key="index" >
            <knowledge-article-card :knowledge="article"></knowledge-article-card>
          </li>
        </ul>
      </div>
      <div class="expert-info-footer">
        <div class="expert-info-footer-item concern" @click.stop="concernChange()">
          <i class="iconfont icon-quxiaoguanzhu" v-if="expertInfo.hasConcern"></i>
          <i class="iconfont icon-tianjiaguanzhu" v-if="!expertInfo.hasConcern"></i>
          <p class="concern-status">{{expertInfo.hasConcern ? '已关注' : '加关注'}}</p>
        </div>
        <div class="expert-info-footer-item online" v-if="userType != '2'" @click="clickConsult(expertInfo)">线上咨询</div>
        <div class="expert-info-footer-item phone"  v-if="userType != '2' && expertInfo.phone" @click="clickCallPhone(expertInfo.phone)">电话咨询</div>
      </div>
    </div>
    <g-noresult
    v-if="!expertInfo.id"
    :show="!expertInfo.id"
    :message="'没有该专家信息哦~'">
    </g-noresult>
  </div>
</template>
<script>
import knowledgeArticleCard from '../../home/components/knowledge-article-card.vue'
import GNoresult from '@/components/g-noresult/index.vue'
import api from '@/api'
export default {
  components: {
    GNoresult,
    knowledgeArticleCard
  },
  data () {
    return {
      expertInfo: {},
      curTab: 'home', // 当前tab 'home' 或 'knowledge'
      userType: ''
    }
  },
  methods: {
    clickCallPhone (phone) { // 拨打电话
      if (phone) {
        wx.makePhoneCall({
          phoneNumber: phone,
          success: (result) => {
            console.log('拨打电话成功！')
          },
          fail: () => {
            console.log('拨打电话失败！')
          },
          complete: () => {}
        })
      }
    },
    async initConsult (consultInfo) { // 新建咨询室
      await wx.showModal({
        content: '确定要咨询专家？',
        showCancel: true, // 是否显示取消按钮
        cancelColor: 'skyblue', // 取消文字的颜色
        confirmColor: 'skyblue', // 确定文字的颜色
        success: async function (res) {
          if (res.cancel) {
            // 点击取消,默认隐藏弹框
          } else {
            // 点击确定
            let consultId = ''
            await api.consult.addConsult({
              expertId: consultInfo.id
            }).then(res => {
              consultId = res.consultId
            }).catch(err => {
              console.log(err)
            })
            // mock数据：
            consultId = '3444444'

            if (consultId) {
              wx.navigateTo({url: `/pages/consult/detail/main?id=${consultId}`})
            }
          }
        }
      })
    },
    async clickConsult (consultInfo) { // 前往咨询室
      if (!consultInfo.isConsulting) {
        // 新建咨询室：
        this.initConsult(consultInfo)
      } else {
        if (consultInfo.consultId) {
          wx.navigateTo({url: `/pages/consult/detail/main?id=${consultInfo.consultId}`})
        }
      }
    },
    async concernChange () { // 关注与取消关注
      await api.my.concernUser({
        concernedId: this.expertInfo.id, // 被关注者id
        hasConcern: !this.expertInfo.hasConcern
      }).then((res) => {
        if (res) {
          console.log(res.message || '')
          this.expertInfo.hasConcern = !this.expertInfo.hasConcern
        }
      }).catch(err => {
        console.log(err || '系统出错')
      })
      // mock数据：
      this.expertInfo.hasConcern = !this.expertInfo.hasConcern
    },
    switchTab (tab) {
      this.curTab = tab || 'home'
    },
    async getExpertInfo () {
      await api.common.getUserInfo({
        id: this.expertId,
        userType: '2'
      }).then(res => {
        this.expertInfo = res || {}
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.expertInfo = {
        id: '1111111',
        name: '王灿灿',
        nickName: '大会上开发',
        avatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
        academicTitle: '心理老师',
        tagList: ['爱情脱单', '智商情商', '趣味性格', '心理综合'],
        averageScore: 9.0,
        isConsulting: false,
        consultId: '',
        desc: 'kfdjsakfjkdjsafklj附近肯德基案发福建斯科拉放假快乐撒九分裤电费卡开飞机拉师傅就看到了撒父级士大夫附件啊时空裂缝京东数科拉风加快速度拉法基第三方进口量撒酒疯考虑到精神科拉飞机考虑到就说了的顺丰快递费啦', // 详细介绍
        organization: '浙江科技学院',
        hasConcern: true, // 是否关注了
        phone: '15868157426',
        consultorNum: 39, // 咨询者
        fanNum: 20, // 粉丝数量
        knowledgeNum: 20, // 知识库数目
        knowledgeList: [
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
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.getExpertInfo()
  },
  mounted () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#63B8FF'
    })
  }
}
</script>

<style lang="less">
  .page-expert-detail {
    background: #fff;
    .page-expert-detail--container {
      margin-bottom: 50px;
      .expert-info-top {
        padding: 15px 10px;
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-image: linear-gradient(45deg, #fff, #63B8FF);
        .expert-info-top-avatar {
          height: 80px;
          width: 80px;
          border-radius: 50%;
          border: 5px solid #63B8FF;
        }
        .expert-info-top-name {
          font-weight: bold;
          font-size: 16px;
        }
        .expert-info-top-academic-title {
          font-size: 12px;
          color: rgb(156, 151, 151);
        }
      }
      .expert-info-middle {
        border-bottom: 10px solid rgb(240, 240, 240);
        border-top: 2px solid #eee;
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-around;
        .expert-info-middle-tab {
          position: relative;
          padding: 10px;
          font-weight: bold;
          text-align: center;
          &.active {
            color: #63B8FF;
          }
          &.active::after {
            width: 100%;
            display: block;
            content: '';
            height: 5px;
            bottom: 0;
            left: 0;
            background: #63B8FF;
            position: absolute;
          }
        }
      }
      .expert-info-bottom {
        overflow-x: hidden;
        overflow-y: auto;
        .expert-info-bottom-statistic {
          border-bottom: 5px solid rgb(240, 240, 240);
          height: 55px;
          padding: 5px 20px;
          display: flex;
          width: 100%;
          flex-direction: row;
          justify-content: space-around;
          align-self: center;
          .expert-info-bottom-statistic-item {
            padding: 5px 0;
            width: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .item-num {
              font-size: 16px;
              color:  #FFD161;
            }
            .item-unit {
              color: rgb(194, 186, 186);
            }
          }
          .expert-info-bottom-statistic-item-split {
            position: relative;
            right: 0;
            display: block;
            width: 5px;
            height: 30px;
            top: 50%;
            line-height: 45px;
            transform: translateY(-15px);
            background: rgb(238, 237, 237);
          }
        }
        .expert-info-bottom-info {
          padding: 10px 20px;
          .expert-info-bottom-info-item {
            .item-title {
              font-weight: bold;
            }
            .item-content {
              margin: 5px 0 10px 0;
              span {
                display: inline-block;
                border: 0.5px solid #FFD161;
                margin-right: 10px;
                border-radius: 8px;
                color:  #FFD161;
                padding: 3px;
              }
            }
          }
        }
      }
      .tab-knowledge {
        .knowledge-title {
          height: 40px;
          font-weight: bold;
          line-height: 40px;
          padding: 0 20px;
          border-bottom: 0.5px solid #eee;
        }
        .knowledge-list {
          .knowledge-list-item {
            border-bottom: 0.5px solid #eee;
          }
        }
      }
      .expert-info-footer {
        width: 100%;
        position: fixed;
        bottom: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        box-shadow: 0 0 6px rgb(214, 211, 211);
        background: #fff;
        .expert-info-footer-item {
          padding: 15px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          margin: 0;
          &.phone {
            background: #63B8FF;
            color: #fff;
            font-size: 16px;
          }
          &.online {
            background: rgb(160, 224, 243);
            color: #fff;
            font-size: 16px;
          }
          &.concern {
            padding: 0;
            .concern-status {
              font-size: 12px;
              color: rgb(194, 186, 186);
            }
            .iconfont {
              font-size: 24px !important;
              height: 30px;
            }
          }
        }
      }
    }
  }
</style>
