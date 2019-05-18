<template>
  <div class="page-knowledge-article-detail" :style="(!articleInfo.id && !loading) ? 'height: 100%;' : ''">
    <!-- 文章知识库详情 -->
    <div class="page-knowledge-article-detail--container" v-if="articleInfo && articleInfo._id">
      <div class="page-knowledge-article-detail--content">
        <div class="title">{{articleInfo.title}}</div>
        <div class="tips" v-if="articleInfo.author">{{articleInfo.author.name || articleInfo.author.nickName}}  <span class="type">{{articleInfo.tagTypeDesc}}</span></div>
        <div class="create-time">{{articleInfo.createTime}}</div>
        <image class="image" :src="articleInfo.picUrl || defaultImg" mode="aspectFill"></image>
        <div class="content">{{articleInfo.content}}</div>
      </div>
      <div class="page-knowledge-article-detail--comment" v-if="articleInfo.commentNum && userType">
        <div class="count">共{{articleInfo.commentNum}}条评论</div>
        <ul class="comment-list">
          <comment-item-card v-for="(comment, index) in articleInfo.commentList" :key="index" :comment="comment" @on-focus="commentFocus(comment)"></comment-item-card>
        </ul>
      </div>
      <div class="page-knowledge-article-detail--input-conatiner" v-if="userType">
        <input class="page-knowledge-article-detail--input-code" :placeholder="'请输入评论内容'" type="text" @focus="showFocus()" :focus="isFocus" v-model="commentVal"/>
        <p class="page-knowledge-article-detail--submit-btn" @click="submitComment()">发送</p>
      </div>
    </div>
    <g-loading :loading="loading"></g-loading>
    <g-noresult
      :show="!articleInfo._id && !loading"
      :message="'未能查到该文章~'">
    </g-noresult>
  </div>
</template>
<script>
import commentItemCard from './components/comment-item-card.vue'
import GNoresult from '@/components/g-noresult/index.vue'
import GLoading from '@/components/g-loading/index.vue'
import api from '@/api'
export default {
  components: {
    commentItemCard,
    GNoresult,
    GLoading
  },
  data () {
    return {
      defaultImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558159564465&di=f770eac8e641689eab7ea22a48d81297&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201808%2F27%2F20180827183035_mnsbn.thumb.700_0.jpg',
      isFocus: false, // 输入框是否focus
      userType: '',
      knowledgeId: '',
      articleInfo: {
        commentList: []
      },
      loading: false,
      commentVal: '', // 当前评论内容
      curComment: {} // 当前回复的评论
    }
  },
  methods: {
    async getArticleInfo () {
      this.loading = true
      await api.knowledgeBase.getKnowledgeDetailById({
        _id: this.knowledgeId
      }).then(res => {
        if (res && res.data) {
          this.articleInfo = res.data
        }
      }).catch(err => {
        console.log(err)
        this.$toast('系统错误')
      })
      this.loading = false
    },
    commentFocus (comment, type) {
      this.isFocus = true
      this.curComment = comment
    },
    showFocus () {
      console.log(this.isFocus)
    },
    async submitComment () { // 提交评论
      if (!this.commentVal.trim()) {
        this.$toast('请提交评论！')
        return false
      }
      await api.comment.submitComment({
        knowledgeId: this.knowledgeId,
        content: this.commentVal.trim(),
        commentId: this.curComment._id // 对已经存在的评论进行回复，若无，则是新的评论
      }).then(res => {
        if (res) {
          this.commentList.unshift(res)
          this.commentVal = ''
        }
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      let res = {
        content: this.commentVal,
        commentId: Math.round(Math.random() * 1000000),
        userId: '33333',
        createTime: '2019-04-22 23:00:29',
        avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
        userType: '1',
        name: '订单订单付所付',
        nickName: '将豆腐块',
        answerList: []
      }
      this.articleInfo.commentList.unshift(res)
      this.commentVal = ''
      this.isFocus = false
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.knowledgeId = options.id || ''
    if (this.knowledgeId) {
      this.articleInfo = {}
      this.getArticleInfo()
    }
  },
  mounted () {

  }
}
</script>

<style lang="less">
  .page-knowledge-article-detail {
    background: #fff;
    overflow: auto;
    padding-bottom: 50px;
    /*隐藏滚动条*/
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
    .page-knowledge-article-detail--container {
      .page-knowledge-article-detail--content {
        padding: 10px 20px;
        margin: 0 auto;
        text-align: center;
        .title {
          font-size: 16px;
          font-weight: bold;
        }
        .tips {
          margin: 7px 0 5px 0;
          .type {
            border: 1px solid #63B8FF;
            padding: 2px 5px;
            color: #63B8FF;
            margin-left: 4px;
            font-weight: bold;
          }
        }
        .create-time {
          color: rgb(124, 121, 121);
          font-size: 12px;
          margin-bottom: 20px;
        }
        .image {
          width: 100%;
          height: 200px;
          border-radius: 8px;
        }
        .content {
          text-align: left;
          margin-top: 20px;
        }
      }
      .page-knowledge-article-detail--comment {
        padding: 0 20px;
        margin-bottom: 20px;
        .count {
          padding: 10px 0;
        }
      }
      .page-knowledge-article-detail--input-conatiner {
        position: fixed;
        bottom: 0;
        width: 100%;
        background: #63B8FF;
        height: 50px;
        padding: 5px 10px;
        display: flex;
        border: 1px solid #eee;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        .page-knowledge-article-detail--input-code {
          height: 30px;
          background: #fff;
          display: block;
          border-radius: 10px;
          border: 1px solid #eee;
          flex: 1;
          padding: 5px 10px;
        }
        .page-knowledge-article-detail--submit-btn {
          font-size: 16px;
          width: 50px;
          height: 100%;
          display: flex;
          margin-left: 10px;
          align-items: center;
          color: #fff;
        }
      }
    }
  }
</style>
