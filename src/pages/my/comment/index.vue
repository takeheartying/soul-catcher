<template>
  <!-- 别人给我的评论： -->
  <div class="page-my-comment">
    <ul class="page-my-comment--list" v-if="commentList && commentList.length">
      <li class="page-my-comment--item" v-for="(comment, index) in commentList" :key="index">
        <!--
          用户是 学生、家长时： 访问评论者的主页信息 --- 只限于专家主页
          用户是 专家时:  访问评论者的主页信息 --- 不限
        -->
        <image class="page-my-comment--left-part" @click="clickAvatar(comment)" mode="aspectFill" :src="comment.commentatorAvatar"></image>
        <div class="page-my-comment--right-part"  @click="clickComment(comment)">
          <div class="commentator-info">
            <div class="commentator-info-left-part">
              <p class="commentator-name"><span>{{comment.commentatorName}}</span>回复了你的评论</p>
              <p class="commentator-answer-content">{{comment.answerContent}}</p>
            </div>
            <image class="commentator-info-right-part" @click.stop="clickKnowledge(comment)" mode="aspectFill" :src="comment.commentatorAvatar"></image>
          </div>
          <div class="my-comment-info">
            我的评论：{{comment.commentContent}}
          </div>
          <div class="other-comment-info">
            <span>{{comment.commentTime}}</span>&nbsp;.
            <span @click.stop="clickAnswer()">回复</span>&nbsp;.
            <span @click.stop="clickLookover()">查看</span>&nbsp;
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import api from '@/api'
export default {
  data () {
    return {
      userType: '',
      commentList: []
    }
  },
  methods: {
    async getCommentList () {
      // 获取人气专家列表：
      await api.my.getCommentList({
        pageSize: 5
      }).then(res => {
        this.commentList = res || {}
      }).catch(err => {
        console.log(err)
      })
      this.commentList = [
        {
          commentContent: '这里是我给文章或视频的评论内容',
          answerContent: '这里是评论者给我的回复',
          commentatorId: '1111111111111', // 评论者的id号
          commentatorType: '2', // 评论者的用户类型 -- 只有专家才可以被访问主页
          commentTime: '2018-12-02',
          commentatorName: '这是评论者的名字',
          commentatorAvatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
          commentType: 'vedio',
          commentId: '324232424' // 评论所在的文章或视频id
        },
        {
          commentContent: '南大街发烧',
          answerContent: '你有毒毒毒ududuudu',
          commentatorId: '2222222222', // 评论者的id号
          commentatorType: '1', // 评论者的用户类型 -- 只有专家才可以被访问主页
          commentTime: '2018-12-02',
          commentatorName: '王一慈',
          commentatorAvatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
          commentType: 'vedio',
          commentId: '493594589' // 评论所在的文章或视频id
        },
        {
          commentContent: '大家萨克拉飞机到拉萨发了',
          answerContent: '倒计时卡福建路撒房间看到了打发士大夫撒旦撒发的撒的发发生的打法是否是否第三方士大夫撒放撒旦法撒',
          commentatorId: '4444444444', // 评论者的id号
          commentatorType: '2', // 评论者的用户类型 -- 只有专家才可以被访问主页
          commentTime: '2018-12-02',
          commentatorName: '何专家',
          commentatorAvatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
          commentType: 'article',
          commentId: '2349459358748' // 评论所在的文章或视频id
        },
        {
          commentContent: '打卡时发动机号开始发动机',
          answerContent: '多喝水开始疯狂得分哈萨克',
          commentatorId: '333333333333', // 评论者的id号
          commentatorType: '3', // 评论者的用户类型 -- 只有专家才可以被访问主页
          commentTime: '2018-12-02',
          commentatorName: '王家长',
          commentatorAvatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
          commentType: 'article',
          commentId: '493594589' // 评论所在的文章或视频id
        },
        {
          commentContent: '炒豆腐哈斯哦',
          answerContent: '多喝水开始疯狂得分哈萨克',
          commentatorId: '555555555', // 评论者的id号
          commentatorType: '1', // 评论者的用户类型 -- 只有专家才可以被访问主页
          commentTime: '2018-12-02',
          commentatorName: '赵百川',
          commentatorAvatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
          commentType: 'vedio',
          commentId: '334' // 评论所在的文章或视频id
        }
      ]
    },
    clickAvatar (comment) {
      // 用户是 学生、家长时： 访问评论者的主页信息 --- 只限于专家主页
      // 用户是 专家时:  访问评论者的主页信息 --- 不限
      let url = ''
      let commentatorType = ''
      switch (comment.commentatorType) {
        case '1': {
          commentatorType = 'student'
          break
        }
        case '2': {
          commentatorType = 'expert'
          break
        }
        case '3': {
          commentatorType = 'parent'
          break
        }
        default: break
      }
      if (this.userType !== '2' && comment.commentatorType !== '2') {
        url = ``
      } else {
        url = `/pages/${commentatorType}/detail/main?id=${comment.commentatorId}`
        wx.navigateTo({ url })
      }
    },
    clickComment (comment) {

    },
    clickKnowledge (comment) {
      wx.navigateTo({ url: `/pages/knowledge/${comment.commentType}/detail/main` })
    },
    clickAnswer () { // 回复

    },
    clickLookover () { // 查看

    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '我的评论'
    })
    this.getCommentList()
  }
}
</script>

<style lang="less">
  @import "~@/styles/functions.less";
  .page-my-comment {
    background: #fff;
    .page-my-comment--list {
      padding: 10px;
      .page-my-comment--item {
        height: 150px;
        display: flex;
        flex-direction: row;
        .page-my-comment--left-part {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .page-my-comment--right-part {
          border-bottom: 1px solid #eee;
          .commentator-info {
            display: flex;
            flex-direction: row;
            .commentator-info-left-part {
              .commentator-name {
                span {
                  font-weight: bold;
                  display: inline-block;
                  width: 200px;
                  .fn_ellipsis();
                }
              }
              .commentator-answer-content {
                margin: 2px 0;
              }
            }
            .commentator-info-right-part {
              width: 45px;
              height: 45px;
              margin-left: 10px;
            }
          }
          .my-comment-info {
            color: rgb(146, 145, 145);
            background: rgb(224, 222, 222);
            padding: 5px;
            border-radius: 5px;
          }
          .other-comment-info {
            font-sizez: 12px;
            span {
              color: rgb(146, 145, 145);
            }
          }
        }
      }
    }
  }
</style>
