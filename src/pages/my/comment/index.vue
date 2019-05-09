<template>
  <!-- 别人给我的评论： -->
  <div class="page-my-comment">
    <scroll-view  class="page-my-comment--scroll-view"  scroll-y @scrolltolower="bindDownLoad" lower-threshold="100">
      <ul class="page-my-comment--list"  @click="clickPage()" v-if="commentList && commentList.length">
        <li class="page-my-comment--item" v-for="(comment, index) in commentList" :key="index">
          <!--
            用户是 学生、家长时： 访问评论者的主页信息 --- 只限于专家主页
            用户是 专家时:  访问评论者的主页信息 --- 不限
          -->
          <image class="page-my-comment--left-part" @click.stop="clickAvatar(comment)" mode="aspectFill" :src="comment.commentatorAvatar"></image>
          <div class="page-my-comment--right-part"  @click.stop="clickComment(comment)">
            <div class="commentator-info">
              <div class="commentator-info-left-part">
                <div class="commentator-name">
                  <div class="name">{{comment.commentatorNickName}}</div>
                  <div class="tip">回复了你的评论</div>
                </div>
                <p class="commentator-answer-content">{{comment.answerContent}}</p>
              </div>
              <image class="commentator-info-right-part" @click.stop="clickKnowledge(comment)" mode="aspectFill" :src="comment.commentPic"></image>
            </div>
            <div class="my-comment-info">
              我的评论：{{comment.commentContent}}
            </div>
            <div class="other-comment-info">
              <span>{{comment.commentTime}}</span>&nbsp;&nbsp;.&nbsp;&nbsp;
              <span @click.stop="clickAnswer(comment)">回复</span>&nbsp;&nbsp;.&nbsp;&nbsp;
              <span @click.stop="clickKnowledge(comment)">查看</span>
            </div>
          </div>
        </li>
      </ul>
      <g-loading :loading="loading"></g-loading>
      <g-noresult v-if="!commentList.length" :show="!loading" :message="'还没有评论，快去评论吧~'"></g-noresult>
    </scroll-view>
    <div class="page-my-comment--input-conatiner" v-if="showInput && curComment && curComment.commentTime" @click.stop="clickAnswer(curComment)">
      <input class="page-my-comment--input-code" :placeholder="'回复' + curComment.commentatorNickName + ':'" type="text" :focus="isFocus" :value="commentVal"></input>
      <p class="page-my-comment--submit-btn" @click="submitComment()">发送</p>
    </div>
    <x-action-sheet
      :show="showSelect"
      cancelText="取消"
      :list="actionsList"
      @select="selectActionSheet"
      @cancel="cancelActionSheet" />
  </div>
</template>
<script>
import api from '@/api'
import XActionSheet from '@/components/x-action-sheet/index.vue'
import GLoading from '@/components/g-loading/index.vue'
import GNoresult from '@/components/g-noresult/index.vue'
export default {
  components: {
    XActionSheet,
    GLoading,
    GNoresult
  },
  data () {
    return {
      loading: false,
      finished: false,
      pageNo: 1,
      userType: '',
      commentList: [],
      isFocus: true,
      showInput: false, // 显示回复的输入框
      commentVal: '', // 输入框的回复内容
      curComment: {}, // 当前评论
      selectIndex: -1,
      showSelect: false, // 显示 ActionSheet
      actionsList: ['回复', '查看'] // 显示的actionSheet 选择的项目列表
    }
  },
  methods: {
    async getCommentList () {
      // 获取人气专家列表：
      this.loading = true
      this.finished = false
      await api.my.getCommentList({
        pageSize: 5,
        pageNo: this.pageNo
      }).then(res => {
        this.commentList = res || {}
      }).catch(err => {
        console.log(err)
      })
      let res = {
        pageSize: 5,
        pageNo: 1,
        pageCount: 3,
        items: [
          {
            commentContent: '这里是我给文章或视频的评论内容',
            answerContent: '这里是评论者给我的回复',
            commentatorId: '1111111111111', // 评论者的id号
            commentatorType: '2', // 评论者的用户类型 -- 只有专家才可以被访问主页
            commentTime: '2018-12-02',
            commentatorNickName: '这是评论者的名字',
            commentatorAvatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
            commentType: 'vedio',
            commentPic: 'http://img0.imgtn.bdimg.com/it/u=2845055246,1084882918&fm=26&gp=0.jpg',
            commentId: '324232424' // 评论所在的文章或视频id
          },
          {
            commentContent: '南大街发烧',
            answerContent: '你有毒毒毒ududuudu',
            commentatorId: '2222222222', // 评论者的id号
            commentatorType: '1', // 评论者的用户类型 -- 只有专家才可以被访问主页
            commentTime: '2018-12-02',
            commentatorNickName: '王一慈',
            commentatorAvatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
            commentType: 'vedio',
            commentPic: 'http://img0.imgtn.bdimg.com/it/u=2845055246,1084882918&fm=26&gp=0.jpg',
            commentId: '493594589' // 评论所在的文章或视频id
          },
          {
            commentContent: '大家萨克拉飞机到拉萨发了',
            answerContent: '倒计时卡福建路撒房间看到了打发士大夫撒旦撒发的撒的发发生的打法是否是否第三方士大夫撒放撒旦法撒',
            commentatorId: '4444444444', // 评论者的id号
            commentatorType: '2', // 评论者的用户类型 -- 只有专家才可以被访问主页
            commentTime: '2018-12-02',
            commentatorNickName: '何专家',
            commentatorAvatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
            commentType: 'article',
            commentPic: 'http://img0.imgtn.bdimg.com/it/u=2845055246,1084882918&fm=26&gp=0.jpg',
            commentId: '2349459358748' // 评论所在的文章或视频id
          },
          {
            commentContent: '打卡时发动机号开始发动机',
            answerContent: '多喝水开始疯狂得分哈萨克',
            commentatorId: '333333333333', // 评论者的id号
            commentatorType: '3', // 评论者的用户类型 -- 只有专家才可以被访问主页
            commentTime: '2018-12-02',
            commentatorNickName: '王家长',
            commentatorAvatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
            commentType: 'article',
            commentPic: 'http://img0.imgtn.bdimg.com/it/u=2845055246,1084882918&fm=26&gp=0.jpg',
            commentId: '493594589' // 评论所在的文章或视频id
          },
          {
            commentContent: '炒豆腐哈斯哦',
            answerContent: '多喝水开始疯狂得分哈萨克',
            commentatorId: '555555555', // 评论者的id号
            commentatorType: '1', // 评论者的用户类型 -- 只有专家才可以被访问主页
            commentTime: '2018-12-02',
            commentatorNickName: '赵百川',
            commentatorAvatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
            commentType: 'vedio',
            commentPic: 'http://img0.imgtn.bdimg.com/it/u=2845055246,1084882918&fm=26&gp=0.jpg',
            commentId: '334' // 评论所在的文章或视频id
          }
        ]
      }
      this.loading = false
      this.commentList = this.commentList.concat(res.items)
      this.finished = (res.pageCount && this.pageNo >= res.pageCount)
    },
    bindDownLoad () { // 上拉加载
      if (!this.finished) {
        this.pageNo++
        this.getCommentList()
      }
    },
    clickAvatar (comment) {
      // 用户是 学生、家长时： 访问评论者的主页信息 --- 只限于专家主页
      // 用户是 专家时:  访问评论者的主页信息[家长无主页] --- 不限
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
        default: break
      }
      if ((this.userType === '1' || this.userType === '3') && commentatorType === 'expert') { // 学生或家长 只能看专家主页
        url = `/pages/expert/detail/main?id=${comment.commentatorId}`
        wx.navigateTo({url})
      } else if (this.userType === '2' && commentatorType) { // 专家 可看 学生或其他专家主页
        url = `/pages/${commentatorType}/detail/main?id=${comment.commentatorId}`
        wx.navigateTo({url})
      } else {
        url = ``
      }
    },
    clickComment (comment) { // 唤起ActionSheet
      if (this.showInput) { //
        this.clickPage()
      } else {
        this.curComment = comment
        this.showSelect = true
        this.showInput = false
      }
    },
    cancelActionSheet () {
      this.showSelect = false
      this.curComment = {}
      this.selectIndex = -1
    },
    selectActionSheet (index) {
      this.showSelect = false
      this.selectIndex = index
      if (index === 0) {
        this.clickAnswer(this.curComment)
      } else if (index === 1) {
        this.clickKnowledge(this.curComment)
      }
    },
    clickKnowledge (comment) {
      if (comment) {
        wx.navigateTo({ url: `/pages/knowledge/${comment.commentType}/detail/main?id=${comment.commentId}` })
      }
    },
    clickAnswer (comment) { // 回复
      this.isFocus = true
      this.curComment = comment
      this.showInput = true
    },
    async submitComment () { // 发送回复
      await api.comment.submitComment({
        comment: this.commentVal
      }).then(res => {
        this.commentVal = ''
        this.curComment = {}
        this.$toast('发送成功！')
        this.focus = false
        this.showInput = false
      }).catch(err => {
        console.log(err)
        this.$toast('发送失败！')
      })
    },
    clickPage () {
      this.commentVal = ''
      this.focus = false
      this.curComment = {}
      this.showInput = false
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
    height:100%;
    background: #fff;
    padding-bottom: 20px;
    display: flex;
    .page-my-comment--input-conatiner {
      width: 100%;
      position: fixed;
      background: #fff;
      bottom: 0;
      height: 50px;
      padding: 5px 10px;
      display: flex;
      border: 1px solid #eee;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
      .page-my-comment--input-code {
        height: 40px;
        display: block;
        border-radius: 10px;
        border: 1px solid #eee;
        flex: 1;
        padding: 5px 10px;
      }
      .page-my-comment--submit-btn {
        font-size: 16px;
        width: 50px;
        height: 100%;
        display: flex;
        margin-left: 10px;
        align-items: center;
      }
    }
    .page-my-comment--scroll-view {
      flex: 1;
      /*隐藏滚动条*/
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }
    }
    .page-my-comment--list {
      .page-my-comment--item {
        padding: 10px 10px 0 10px;
        display: flex;
        flex-direction: row;
        .page-my-comment--left-part {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .page-my-comment--right-part {
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
                .tip {
                  position: relative;
                  margin-left: 3px;
                }
              }
              .commentator-answer-content {
                margin: 4px 0 6px 0;
              }
            }
            .commentator-info-right-part {
              width: 45px;
              height: 45px;
              margin-left: 10px;
            }
          }
          .my-comment-info {
            color: rgb(202, 199, 199);
            background: rgb(243, 240, 240);
            padding: 8px;
            border-radius: 5px;
            margin: 3px 0 5px 0;
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
    }
  }
</style>
