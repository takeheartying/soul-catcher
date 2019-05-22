<template>
  <div class="page-my-warn">
    <!-- 我的预警 -->
    <scroll-view  class="page-my-warn--scroll-view"  scroll-y @scrolltolower="bindDownLoad" lower-threshold="100">
      <ul class="page-my-warn--list" v-if="warnList && warnList.length">
        <navigator class="page-my-warn--item" v-for="(warn, index) in warnList" :key="index" :url="'/pages/score/detail/main?id=' + warn.id + '&scoreType=student'">
          <image class="page-my-warn--item-left-part" :src="defaultPic" mode="aspectFill"></image>
          <div class="page-my-warn--item-middle-part">
            <p class="warn-nickname">{{warn.name || warn.nickName}}</p>
            <p class="warn-goodat">擅长：{{warn.goodAt}}</p>
            <p class="warn-time">{{warn.createTime}}</p>
          </div>
          <div class="page-my-warn--item-right-part">
            <div class="consult-score-content" >{{warn.score ? warn.score + '分' : '暂无'}}</div>
          </div>
        </navigator>
      </ul>
      <g-loading :loading="loading"></g-loading>
      <g-noresult v-if="!warnList.length" :show="!loading" :message="'还没有任何预警哦~'"></g-noresult>
    </scroll-view>
  </div>
</template>
<script>
import api from '@/api'
import GLoading from '@/components/g-loading/index.vue'
import GNoresult from '@/components/g-noresult/index.vue'
export default {
  components: {
    GLoading,
    GNoresult
  },
  data () {
    return {
      defaultPic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1320258899,2257109664&fm=26&gp=0.jpg',
      loading: false,
      finished: false,
      pageNo: 1,
      userType: '',
      warnList: []
    }
  },
  methods: {
    async getWarnList () {
      // 获取预警列表：<= 4分
      this.loading = true
      this.finished = false
      await api.my.getWarnList({
        pageSize: 10,
        pageNo: this.pageNo
      }).then(res => {
        this.warnList = res || []
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
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '对我的积分地方的萨芬的阿道夫大师傅大师傅',
            name: '陈天源',
            goodAt: '爱情脱单、智商情商、心理综合',
            createTime: '2019-03-12',
            score: 4.0,
            id: '23343243'
          },
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '王大锤',
            name: '王大锤',
            goodAt: '爱情脱单、智商情商、趣味性格、心理综合',
            createTime: '2019-05-18',
            score: 3.0,
            id: '23343243'
          },
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '对我的积分地方的萨芬的阿道夫大师傅大师傅',
            name: '鸿飞',
            goodAt: '爱情脱单、智商情商',
            createTime: '2019-05-19',
            score: 3.0,
            id: '23343243'
          },
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '对我的积分地方的萨芬的阿道夫大师傅大师傅',
            name: '陈阳',
            goodAt: '智商情商、趣味性格、心理综合',
            createTime: '2019-05-10',
            score: 3.0,
            id: '23343243'
          },
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '对我的积分地方的萨芬的阿道夫大师傅大师傅',
            name: '何方辉',
            goodAt: '爱情脱单、智商情商、趣味性格、心理综合',
            createTime: '2019-05-20',
            score: 2.0,
            id: '23343243'
          },
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '对我的积分地方的萨芬的阿道夫大师傅大师傅',
            name: '王静',
            goodAt: '爱情脱单、智商情商、趣味性格',
            createTime: '2019-05-12',
            score: 1.0,
            id: '23343243'
          },
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '对我的积分地方的萨芬的阿道夫大师傅大师傅',
            name: '岑方',
            goodAt: '爱情脱单、智商情商、趣味性格、心理综合',
            createTime: '2019-03-10',
            score: 2.0,
            id: '23343243'
          },
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '对我的积分地方的萨芬的阿道夫大师傅大师傅',
            name: '洪福',
            goodAt: '爱情脱单、趣味性格、心理综合',
            createTime: '2019-03-10',
            score: 2.0,
            id: '23343243'
          },
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '对我的积分地方的萨芬的阿道夫大师傅大师傅',
            name: '陈晓军',
            goodAt: '爱情脱单、智商情商、趣味性格、心理综合',
            createTime: '2019-03-30',
            score: 3.0,
            id: '23343243'
          },
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '对我的积分地方的萨芬的阿道夫大师傅大师傅',
            name: '钱中',
            goodAt: '爱情脱单、智商情商、趣味性格、心理综合',
            createTime: '2019-05-14',
            score: 0,
            id: '23343243'
          }
        ]
      }
      this.loading = false
      this.warnList = this.warnList.concat(res.items)
      this.finished = (res.pageCount && this.pageNo >= res.pageCount)
    },
    bindDownLoad () { // 上拉加载
      if (!this.finished) {
        this.pageNo++
        this.getWarnList()
      }
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '我的预警'
    })
    this.getWarnList()
  }
}
</script>

<style lang="less">
  @import "~@/styles/functions.less";
  .page-my-warn {
    height:100%;
    background: #fff;
    padding-bottom: 20px;
    display: flex;
    .page-my-warn--scroll-view {
      flex: 1;
      /*隐藏滚动条*/
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }
      .page-my-warn--list {
        background: #fff;
        .page-my-warn--item:nth-child(1) {
          border-top: 1px solid #eee;
        }
        .page-my-warn--item {
          border-bottom: 1px solid #eee;
          padding: 10px 10px 0 10px;
          display: flex;
          flex-direction: row;
          .page-my-warn--item-left-part {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            margin-right: 10px;
          }
          .page-my-warn--item-middle-part {
            flex: 1;
            .warn-nickname {
              font-weight: bolder;
              max-width: 250px;
              .fn_ellipsis();
            }
            .warn-goodAt {
              margin: 0 0 0 0;
            }
            .warn-time {
              font-size: 12px;
              .fn_ellipsis();
              color: rgb(160, 157, 157);
            }
          }
          .page-my-warn--item-right-part {
            margin-left: 10px;
            display:flex;
            align-items:center;
            justify-content:center;
            flex-direction:row;
            .consult-score-content {
              color: #FFD161;
              font-size: 16px;
              font-weight: bolder;
            }
          }
        }
      }
    }
  }
</style>
