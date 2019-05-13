<template>
  <div class="comment-item-card">
    <image class="comment-item-card--left-part" @click.stop="clickAvatar(comment)" mode="aspectFill" :src="comment.avatar"></image>
    <div class="comment-item-card--right-part"  @click.stop="clickComment(comment)">
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
        <span @click.stop="clickComment(comment)">回复</span>&nbsp;&nbsp;.&nbsp;&nbsp;
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
  methods: {
    clickAvatar (comment) {
      // 用户是 学生、家长时： 访问评论者的主页信息 --- 只限于专家主页
      // 用户是 专家时:  访问评论者的主页信息[家长无主页] --- 不限
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
      if ((this.userType === '1' || this.userType === '3') && commentatorType === 'expert') { // 学生或家长 只能看专家主页
        url = `/pages/expert/detail/main?id=${comment.userId}`
        wx.navigateTo({url})
      } else if (this.userType === '2' && commentatorType) { // 专家 可看 学生或其他专家主页
        url = `/pages/${commentatorType}/detail/main?id=${comment.userId}`
        wx.navigateTo({url})
      } else {
        url = ``
      }
    },
    clickComment () { // 点击评论进行回复
      this.$emit('on-focus', this.comment) // 触发父组件 --- 输入框focus
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
    }
  }
</style>
