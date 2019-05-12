<template>
  <!-- 我的消息：最近两天的消息 -->
  <!--
    消息类型 0 新增关注 1 新增聊天 2 咨询评分 3 预警提示 4 新增评论
    学生消息： 0 1 3 4
    专家消息： 0 1 2 4
    家长消息： 0 1 2 3
   -->
  <section class="page-my-message">
    <div class="page-my-message--list" v-if="messageList && messageList.length">
      <div class="page-my-message--items">
        <div class="page-my-message--item" v-for="(message, index) in messageList" :key="index" @click="clickMsg(message)">
          <image class="page-my-message--item-left-part" :src="message.applicantAvatar || message.msgPic"></image>
          <div class="page-my-message--item-middle-part">
            <p class="msg-desc">{{message.msgDesc}}</p>
            <div class="msg-content">
              <div class="common-content">
                <p class="msg-nickname">{{message.applicantName || message.applicantNickName}}</p>
                <p class="msg-tip" v-if="message.msgType === 0">开始关注你了</p>
                <p class="msg-tip" v-if="message.msgType === 1">邀请你加入咨询室</p>
                <p class="msg-tip" v-if="message.msgType === 2">给你评分了</p>
                <p class="msg-tip" v-if="message.msgType === 3">测评了你的心理状况</p>
                <p class="msg-tip" v-if="message.msgType === 4">回复了你的评论</p>
              </div>
              <div class="comment-content" v-if="message.msgType === 4">
                <p class="msg-comment-answer-content">{{message.answerContent}}</p>
                <p class="msg-comment-content">{{message.commentContent}}</p>
              </div>
            </div>
            <p class="msg-time">{{message.msgTime}}</p>
          </div>
          <div class="page-my-message--item-right-part">
            <button class="msg-btn" v-if="message.msgType === 0 && !message.hasConcern" @click.stop="concernFans(message, index)">回粉</button>
            <button class="msg-btn grey" v-if="message.msgType === 0 && message.hasConcern" @click.stop="cancelConcern(message, index)">已关注</button>
            <button class="msg-btn" v-if="message.msgType === 1 && !message.hasJoin" @click.stop="agreeConsult(message, index)">同意</button>
            <button class="msg-btn grey" v-if="message.msgType === 1 && message.hasJoin">已同意</button>
            <div class="consult-score-content" v-if="message.msgType === 2 && message.consultScore">{{message.consultScore}}分</div>
            <div class="consult-score-content" v-if="message.msgType === 3 && message.warnScore">{{message.warnScore}}分</div>
          </div>
        </div>
      </div>
    </div>
    <g-noresult
    v-if="!messageList.length"
    :show="true"
    :message="'还没有任何消息~'">
    </g-noresult>
  </section>
</template>
<script>
import api from '@/api'
import GNoresult from '@/components/g-noresult/index.vue'
import moment from 'moment'
export default {
  components: {
    GNoresult
  },
  data () {
    return {
      userType: '',
      messageList: []
    }
  },
  methods: {
    async getMsgList () {
      // 获取两天内消息列表：
      await api.my.getMsgList({
        dateBegin: moment().subtract(2, 'days')
      }).then(res => {
        this.messageList = res || []
      }).catch(err => {
        console.log(err)
      })
      this.messageList = [
        {
          msgType: 0,
          msgDesc: '新增关注',
          msgTime: '2018-05-08',
          msgPic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3914550423,2613559085&fm=26&gp=0.jpg',
          applicantNickName: '关注者的昵称',
          applicantUserType: '1', // 关注者的用户类型
          applicantAvatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557296506267&di=54627c45d15fb804ed5cdd0d007595b9&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180419%2Fbede4a5c0d574550adf1714feaf10faa.jpeg', // 粉丝头像
          fansId: '11111111', // 关注者的id，用于去主页,
          hasConcern: false // 是否已经关注了该粉丝
        },
        {
          msgType: 0,
          msgDesc: '新增关注',
          msgTime: '2018-05-08',
          msgPic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3914550423,2613559085&fm=26&gp=0.jpg',
          applicantNickName: '关注者的昵称',
          applicantUserType: '2', // 关注者的用户类型
          applicantAvatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557296506267&di=54627c45d15fb804ed5cdd0d007595b9&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180419%2Fbede4a5c0d574550adf1714feaf10faa.jpeg', // 粉丝头像
          fansId: '222222', // 关注者的id，用于去主页,
          hasConcern: true // 是否已经关注了该粉丝
        },
        {
          msgType: 1,
          msgDesc: '新增聊天',
          msgTime: '2018-05-08',
          msgPic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2402497899,2167279511&fm=26&gp=0.jpg', // 消息图标
          applicantUserType: '2', // 申请者的用户类型
          applicantNickName: '申请者昵称',
          consultId: '233323', // 咨询id,用于去聊天窗口
          hasJoin: false
        },
        {
          msgType: 1,
          msgDesc: '新增聊天',
          msgTime: '2018-05-08',
          msgPic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2402497899,2167279511&fm=26&gp=0.jpg', // 消息图标
          applicantUserType: '2', // 申请者的用户类型
          applicantNickName: '申请者昵称',
          consultId: '453453', // 咨询id,用于去聊天窗口
          hasJoin: true // 同意进入咨询室窗口
        },
        {
          msgType: 2,
          msgDesc: '咨询评分',
          msgTime: '2018-05-08',
          msgPic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3302905560,728172851&fm=26&gp=0.jpg', // 消息图标
          applicantUserType: '1', // 申请者的用户类型
          applicantNickName: '申请者昵称',
          consultScore: '9.0',
          consultId: '453453' // 咨询id,用于去聊天窗口
        },
        {
          msgType: 3,
          msgDesc: '预警提示',
          msgTime: '2018-05-08',
          msgPic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1320258899,2257109664&fm=26&gp=0.jpg',
          applicantName: '王大锤',
          applicantUserType: '2', // 申请者的用户类型
          applicantNickName: '申请者昵称',
          warnScore: '3.0', // 预警状况评分 <= 4 且该次聊天结束 将会纳入预警范围
          warnId: '453453' // 预警id,用于去查看我的预警
        },
        {
          msgType: 4,
          msgDesc: '新增评论',
          msgTime: '2018-05-08',
          msgPic: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3406460170,4212211832&fm=26&gp=0.jpg',
          applicantAvatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2150992516,3202248268&fm=26&gp=0.jpg',
          applicantUserType: '2', // 申请者的用户类型
          applicantNickName: '评论者昵称',
          commentContent: '我的评论内容',
          answerContent: '他的回复内容',
          commentType: 'article',
          commentId: '453453' // 评论文章或视频所在的id,用于去查看知识库
        }
      ]
    },
    clickMsg (message) {
      let url = ''
      switch (message.msgType) {
        case 0: { // 新增关注 -- 去粉丝主页
          let userHome = '' // 用户主页类型
          if (message.applicantUserType === '1') {
            userHome = 'student'
          } else if (message.applicantUserType === '2') {
            userHome = 'expert'
          }

          if ((this.userType === '1' || this.userType === '3') && userHome === 'expert') { // 学生或家长 只能看专家主页
            url = `/pages/expert/detail/main?id=${message.fansId}`
          } else if (this.userType === '2' && userHome) { // 专家 可看 学生或其他专家主页
            url = `/pages/${userHome}/detail/main?id=${message.fansId}`
          } else {
            url = ``
          }
          break
        }
        case 1: { // 新增聊天 -- 去咨询聊天窗口
          if (message.hasJoin) {
            url = `/pages/consult/detail/main?id=${message.consultId}`
          }
          break
        }
        case 2: { // 咨询评分 -- 去咨询聊天窗口【需要同意才可以】
          url = `/pages/consult/detail/main?id=${message.consultId}`
          break
        }
        case 3: { // 预警提示 -- 去我的预警描述详情
          url = `/pages/score/detail/main?id=${message.warnId}&scoreType=student`
          break
        }
        case 4: { // 新增评论
          url = `/pages/knowledge/${message.commentType}/detail/main?id=${message.commentId}`
          break
        }
        default: break
      }
      if (url) {
        wx.navigateTo({url})
      }
    },
    async concernFans (message, index) { // 回粉、关注粉丝
      await api.my.concernUser({
        concernedId: message.fansId, // 被关注者id
        hasConcern: true
      }).then((res) => {
        if (res) {
          this.messageList[index].hasConcern = true
        }
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.messageList[index].hasConcern = true
    },
    async cancelConcern (message, index) { // 取消关注
      let that = this
      wx.showModal({
        // title: '取消关注',
        content: '确定要取消关注？',
        showCancel: true, // 是否显示取消按钮
        // cancelText: '否', // 默认是“取消”
        cancelColor: 'skyblue', // 取消文字的颜色
        // confirmText: '是', // 默认是“确定”
        confirmColor: 'skyblue', // 确定文字的颜色
        success: async function (res) {
          if (res.cancel) {
            // 点击取消,默认隐藏弹框
          } else {
            // 点击确定
            await api.my.concernUser({
              concernedId: message.fansId, // 被关注者id
              hasConcern: false
            }).then((res) => {
              if (res) {
                that.messageList[index].hasConcern = false
              }
            }).catch(err => {
              console.log(err)
            })

            // mock数据：
            that.messageList[index].hasConcern = false
          }
        },
        fail: function (res) {}, // 接口调用失败的回调函数
        complete: function (res) {} // 接口调用结束的回调函数（调用成功、失败都会执行）
      })
    },
    async agreeConsult (message, index) { // 同意进入咨询室
      await api.my.agreeConsult({
        consultId: message.consultId,
        hasJoind: true
      }).then((res) => {
        if (res) {
          this.messageList[index].hasJoin = true
          wx.navigateTo({url: `/pages/consult/detail/main?id=${message.consultId}`})
        }
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.messageList[index].hasJoin = true
      wx.navigateTo({url: `/pages/consult/detail/main?id=${message.consultId}`})
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '我的消息'
    })
    this.getMsgList()
  }
}
</script>

<style lang="less">
  @import "~@/styles/functions.less";
  .page-my-message {
    height: 100%;
    background: #fff;
    .page-my-message--list {
      .page-my-message--items {
        background: #fff;
        .page-my-message--item:nth-child(1) {
          border-top: 1px solid #eee;
        }
        .page-my-message--item {
          padding: 10px;
          border-bottom: 1px solid #eee;
          display: flex;
          flex-direction: row;
          .page-my-message--item-left-part {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            margin-right: 10px;
          }
          .page-my-message--item-middle-part {
            flex: 1;
            .msg-desc {
              font-weight: bolder;
            }
            .msg-content {
              margin: 5px 0;
              .common-content {
                display: flex;
                flex-direction: row;
                .msg-nickname {
                  font-weight: bolder;
                  max-width: 115px;
                  .fn_ellipsis();
                }
                .msg-tip {
                  margin-left: 10px;
                  width: 120px;
                }
              }
              .comment-content {
                .msg-comment-answer-content {
                  margin: 0 0 0 0;
                }
                .msg-comment-content {
                  color: rgb(202, 199, 199);
                  background: rgb(243, 240, 240);
                  padding: 8px;
                  border-radius: 5px;
                  margin: 3px 0 5px 0;
                }
              }
            }
            .msg-time {
              font-size: 12px;
              color: rgb(160, 157, 157);
            }
          }
          .page-my-message--item-right-part {
            margin-left: 10px;
            display:flex;
            align-items:center;
            justify-content:center;
            flex-direction:row;
            .msg-btn {
              border-radius: 10px;
              border: 1px solid #FFD161;
              font-size: 14px;
              color: #FFD161;
              background: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 10px;
              height: 30px;
              &.grey {
                border: 1px solid rgb(216, 213, 213);
                color: rgb(160, 157, 157);
              }
            }
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

