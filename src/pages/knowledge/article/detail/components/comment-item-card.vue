<template>
  <div class="comment-item-card">
    <image class="comment-item-card--left-part" @click.stop="clickAvatar(comment)" mode="aspectFill" :src="comment.avatar"></image>
    <div class="comment-item-card--right-part">
      <!-- 初始评论区： -->
      <div class="comment-container"   @click.stop="clickComment(comment)">
        <div class="commentator-info">
          <div class="commentator-info-left-part">
            <div class="commentator-name">
              <div class="name">{{comment.nickName}}</div>
            </div>
            <p class="commentator-answer-content">{{comment.content}}</p>
          </div>
        </div>
        <div class="other-comment-info">
          <span>{{comment.createTime}}</span>&nbsp;&nbsp;.&nbsp;&nbsp;
          <span @click.stop="clickComment(comment)">回复</span>
        </div>
      </div>
      <!-- 初始评论区的回复： -->
      <div class="answer-contanier">
        <image class="comment-item-card--left-part" @click.stop="clickAvatar(comment)" mode="aspectFill" :src="comment.avatar"></image>
        <div class="comment-item-card--right-part">
          <div class="commentator-info">
            <div class="commentator-info-left-part">
              <div class="commentator-name">
                <div class="name">{{comment.nickName}}</div>
              </div>
              <p class="commentator-answer-content">{{comment.content}}</p>
            </div>
          </div>
          <div class="other-comment-info">
            <span>{{comment.createTime}}</span>&nbsp;&nbsp;.&nbsp;&nbsp;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    comment: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      userType: ''
    }
  },
  onLoad () {
    this.userType = this.$app.globalData.userType || ''
  },
  methods: {
    clickAvatar (comment) {
      let url = ''
      let commentatorType = ''
      switch (comment.userType) {
        case '1': {
          commentatorType = 'student'
          break
        }
        case '2': {
          commentatorType = 'expert'
          break
        }
        default: break
      }
      if (commentatorType) {
        url = `/pages/${commentatorType}/detail/main?id=${comment.userId}`
        wx.navigateTo({url})
      } else {
        url = ``
      }
    },
    clickComment () { // 点击评论进行回复
      this.$emit('on-focus', this.comment, 'answer') // 触发父组件 --- 输入框focus,类型是 对评论的回复
    }
  }
}
</script>

<style lang="less">
  @import "~@/styles/functions.less";
  .comment-item-card {
    padding: 10px 0 0 0;
    display: flex;
    flex-direction: row;
    .comment-item-card--left-part {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .comment-item-card--right-part {
      flex: 1;
      border-bottom: 1px solid #eee;
      .commentator-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .commentator-info-left-part {
          flex: 1;
          .commentator-name {
            display: flex;
            flex-direction: row;
            .name {
              font-weight: bolder;
              max-width: 150px;
              .fn_ellipsis();
            }
          }
          .commentator-answer-content {
            margin: 4px 0 6px 0;
          }
        }
      }
      .other-comment-info {
        margin-top: 5px;
        margin-bottom: 9px;
        font-size: 12px;
        span {
          color: rgb(146, 145, 145);
        }
      }
      .answer-contanier {
        padding: 10px 0 0 0;
        display: flex;
        flex-direction: row;
        .comment-item-card--left-part {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-right: 10px;
        }
      }
    }
  }
</style>
