<template>
  <div class="page-consult-detail">
    <!-- 咨询详情页： -->
    <!-- consultStatus: ''    邀请中 0    待同意 1    已同意 2    已关闭 3 -->
    <div class="page-consult-detail--status-container">
      <div class="page-consult-detail--status" v-if="consultInfo.consultStatusDesc">状态：{{consultInfo.consultStatusDesc}}</div>
      <div class="page-consult-detail--btns" v-if="consultInfo.consultStatus !== 3">
        <button class="page-consult-detail--btn" v-if="userType !== '2'"  @click="editScore()">专家咨询评分</button>
        <button class="page-consult-detail--btn" v-if="userType === '2'"  @click="editScore()">学生状况评分</button>

        <button class="page-consult-detail--btn" v-if="consultInfo.consultStatus !== 3"  @click="closeConsult()">关闭咨询室</button>
        <button class="page-consult-detail--btn" v-if="consultInfo.userList && consultInfo.userList.parent && !consultInfo.userList.parent.isInvited" @click="inviteUser('parent')">邀请家长</button>
        <button class="page-consult-detail--btn" v-if="consultInfo.userList && consultInfo.userList.student && !consultInfo.userList.student.isInvited"  @click="inviteUser('student')">邀请学生</button>
      </div>
    </div>
    <scroll-view  class="page-consult-detail--scroll-view" :scroll-into-view="scrollToView" @scrolltoupper="bindLoadData()"  scroll-y v-if="consultInfo.id" :upper-threshold="50">
      <g-loading :loading="loading"></g-loading>
      <ul class="page-consult-detail--list" v-if="consultInfo.chatList && consultInfo.chatList.length">
        <li class="page-consult-detail--list-item" :id="'id_' + chat.chatId" v-for="(chat, index) in consultInfo.chatList" :key="index">
          <div class="left-chat" v-if="chat.userType !== userType">
            <image class="chat-avatar" mode="aspectFill" :src="chat.avatar"></image>
            <div class="chat-info">
              <div class="line1">
                <span>{{chat.name || chat.nickName}}</span>
                <span>  {{chat.createTime}}</span>
              </div>
              <div class="line2">
                <div class="chat-content speech">{{chat.content}}</div>
              </div>
            </div>
          </div>
          <div class="right-chat" v-if="chat.userType === userType">
            <div class="chat-info">
              <div class="line1">
                <span>{{chat.name || chat.nickName}}</span>
                <span>  {{chat.createTime}}</span>
              </div>
              <div class="line2">
                <div class="chat-content speech">{{chat.content}}</div>
              </div>
            </div>
            <image class="chat-avatar" mode="aspectFill" :src="chat.avatar"></image>
          </div>
        </li>
      </ul>
    </scroll-view>
    <!-- 已同意 状态下才可以聊天： -->
    <div class="page-consult-detail--input-conatiner" v-if="consultInfo.consultStatus === 2">
      <input class="page-consult-detail--input-code" :placeholder="'请输入聊天内容'" type="text" :focus="true" v-model="chatVal"/>
      <p class="page-consult-detail--submit-btn" @click="submitChat()">发送</p>
    </div>
  </div>
</template>

<script>
import GLoading from '@/components/g-loading/index.vue'
import api from '@/api'
export default {
  components: {
    GLoading
  },
  data () {
    return {
      loading: false,
      finished: false,
      pageNo: 1,
      scrollToView: '',
      consultInfo: {
        id: '',
        userType: '',
        userList: {
          parent: {
            id: '',
            hasJoined: false,
            isInvited: false // 是否被邀请
          },
          student: {
            id: '',
            hasJoined: false,
            isInvited: false // 是否被邀请
          },
          expert: {
            id: '',
            hasJoined: false,
            isInvited: false // 是否被邀请
          }
        },
        chatList: [],
        consultStatus: '', // 邀请中 0   待同意 1    已同意 2   已关闭 3
        consultStatusDesc: ''
      },
      chatVal: '',
      userType: ''
    }
  },
  methods: {
    bindLoadData () {
      if (!this.finished) {
        this.pageNo++
        this.loadList()
      }
    },
    async loadList () {
      this.loading = true
      this.finished = false
      await api.my.getConsultDetailById({
        id: this.consultId,
        pageSize: 5,
        pageNo: this.pageNo
      }).then(res => {
        if (res.data && res.data.chatList && res.data.chatList.length) {
          // 滚动条滚动位置：
          this.scrollToView = 'id_' + res.data.chatList[0].chatId
          let chatList = this.consultInfo.chatList
          this.consultInfo = Object.assign({}, res.data)
          this.consultInfo.chatList = [...res.data.chatList.reverse(), ...chatList]
          this.finished = (res.pageCount && this.pageNo >= res.pageCount)
        }
      }).catch(err => {
        console.log(err)
        this.finished = true
      })
      // mock数据：
      let res = {
        pageSize: 5,
        pageNo: 1,
        pageCount: 3,
        data: {
          id: '22222222',
          userType: '1',
          userList: {
            parent: {
              id: '8997989',
              hasJoined: false, // 是否加入
              isInvited: false // 是否被邀请
            },
            student: {
              id: '23232323',
              hasJoined: false,
              isInvited: true // 是否被邀请
            },
            expert: {
              id: '33434343',
              hasJoined: true,
              isInvited: true // 是否被邀请
            }
          },
          chatList: [ // 按照时间，从近到远排序
            {
              content: '2019-01-07 内容11111111111',
              chatId: '4354353525',
              userId: '33333',
              createTime: '2019-04-22 23:00:29',
              avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
              userType: '2',
              name: '打火机的',
              nickName: '将豆腐块'
            },
            {
              content: '2019-01-06 内容2222222222222222',
              chatId: '476589890',
              userId: '33333',
              createTime: '2019-04-22 23:00:29',
              avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
              userType: '3',
              name: '订单订单付所付',
              nickName: '将豆腐块'
            },
            {
              content: '2019-01-05 内容333333333333333333',
              chatId: '2222222222222222222',
              userId: '33333',
              createTime: '2019-04-22 23:00:29',
              avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
              userType: '1',
              name: '王昭君',
              nickName: '将豆腐块'
            },
            {
              content: '2019-01-04 内容444444444444444444444',
              chatId: '100000000034545',
              userId: '33333',
              createTime: '2019-04-22 23:00:29',
              avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
              userType: '3',
              name: '家长名字',
              nickName: '将豆腐块'
            },
            {
              content: '2019-01-03 内容5555555555',
              chatId: '4577657',
              userId: '33333',
              createTime: '2019-04-22 23:00:29',
              avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
              userType: '1',
              name: '王昭君',
              nickName: '将豆腐块'
            },
            {
              content: '2019-01-02 内容666666666666666666666666666',
              chatId: '0968698769',
              userId: '33333',
              createTime: '2019-04-22 23:00:29',
              avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
              userType: '3',
              name: '考虑对方就爱上风口浪尖',
              nickName: '将豆腐块'
            },
            {
              content: '2019-01-01 内容777777777777777',
              chatId: '343qtrwe',
              userId: '33333',
              createTime: '2019-04-22 23:00:29',
              avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
              userType: '2',
              name: '爪机党',
              nickName: '将豆腐块'
            }
          ],
          consultStatus: 2, // 邀请中 0   待同意 1   已同意 2   已关闭 3
          consultStatusDesc: '已同意'
        }
      }
      // 滚动条滚动位置：
      this.scrollToView = 'id_' + res.data.chatList[0].chatId
      let chatList = this.consultInfo.chatList
      this.consultInfo = Object.assign({}, res.data)
      this.consultInfo.chatList = [...res.data.chatList.reverse(), ...chatList]
      this.finished = (res.pageCount && this.pageNo >= res.pageCount)

      this.loading = false
    },
    async submitChat () { // 发送聊天内容
      await api.my.submitChat({
        content: this.chatVal
      }).then(res => {
        if (res.items) {
          this.consultInfo.chatList.push(res)
          this.chatVal = '' // 清空聊天
        }
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      let res = {
        content: this.chatVal,
        chatId: Math.round(Math.random() * 1000000),
        userId: '33333',
        createTime: '2019-04-22 23:00:29',
        avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg',
        userType: '1',
        name: '订单订单付所付',
        nickName: '将豆腐块'
      }
      this.consultInfo.chatList.push(res)
      this.chatVal = ''
      // 滚动条滚动到新增聊天记录的位置：
      this.scrollToView = 'id_' + res.chatId
    },
    inviteUser (type) { // 邀请用户加入咨询室 type: parent / student
      let that = this
      let invitedUserId = this.consultInfo.userList[type].id // 被邀请的用户id
      if (!invitedUserId) return false
      wx.showModal({
        content: '确定要邀请？',
        showCancel: true, // 是否显示取消按钮
        cancelColor: 'skyblue', // 取消文字的颜色
        confirmColor: 'skyblue', // 确定文字的颜色
        success: async function (res) {
          if (res.cancel) {
            // 点击取消,默认隐藏弹框
          } else {
            // 点击确定
            await api.my.addConsultUser({
              consultId: that.consultInfo.id,
              userId: invitedUserId
            }).then((res) => {
              if (res) {
                that.consultInfo.consultStatusDesc = '邀请中'
                that.consultInfo.consultStatus = 0
                that.consultInfo.userList[type].isInvited = true
              }
            }).catch(err => {
              console.log(err)
            })

            // mock数据：
            that.consultInfo.consultStatusDesc = '邀请中'
            that.consultInfo.consultStatus = 0
            that.consultInfo.userList[type].isInvited = true
          }
        }
      })
    },
    closeConsult () { // 关闭咨询室
      let that = this
      wx.showModal({
        content: '确定要取消咨询？',
        showCancel: true, // 是否显示取消按钮
        cancelColor: 'skyblue', // 取消文字的颜色
        confirmColor: 'skyblue', // 确定文字的颜色
        success: async function (res) {
          if (res.cancel) {
            // 点击取消,默认隐藏弹框
          } else {
            // 点击确定
            await api.my.cancelConsult({
              consultId: that.consultInfo.id
            }).then((res) => {
              if (res) {
                that.consultInfo.consultStatusDesc = '已关闭'
                that.consultInfo.consultStatus = 3
              }
            }).catch(err => {
              console.log(err)
            })

            // mock数据：
            that.consultInfo.consultStatusDesc = '已关闭'
            that.consultInfo.consultStatus = 3
          }
        }
      })
    },
    getChatRecord () { // 获取实时聊天记录 ---- ？？？？？？？？？？？？？？？？？？？？？？？？

    },
    editScore () { // 去评分按钮
      let id = ''
      if (this.userType === '1' || this.userType === '3') { // 学生或家长 给专家进行 咨询评分
        id = this.consultInfo.userList.expert.id
      } else if (this.userType === '2') { // 专家给学生进行 心理状况评分
        id = this.consultInfo.userList.student.id
      }
      if (id) { // 前往编辑页 给用户id 为id的人评分
        wx.navigateTo({url: `/pages/score/edit/main?id=${id}&consultId=${this.consultInfo.id}`})
      }
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.consultId = options.id || ''
    this.loadList()
  }
}
</script>

<style lang="less">
  .page-consult-detail {
    height:100%;
    overflow:hidden;
    background: #fff;
    display: flex;
    flex-direction: column;
    .page-consult-detail--status-container {
      border: 1px solid #eee;
      width: 100%;
      max-height: 85px;
      background: #63B8FF;
      padding-bottom: 10px;
      .page-consult-detail--status {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .page-consult-detail--btns {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        width: 100%;
        .page-consult-detail--btn {
          color: #63B8FF;
          padding: 0 10px;
          background: #fff;
          font-size: 14px;
        }
      }
    }
    .page-consult-detail--scroll-view {
      flex: 1;
      background: #fff;
      overflow: auto;
      /*隐藏滚动条*/
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }
      .page-consult-detail--list {
        padding: 10px;
        .page-consult-detail--list-item {
          .speech {
            text-align: left;
            margin: 10px 0;
            padding: 8px;
            table-layout: fixed;
            word-break: break-all;
            position: relative;
            background: -webkit-gradient( linear, 50% 0%, 50% 100%, from(#ffffff), color-stop(0.1, #ececec), color-stop(0.5, #dbdbdb), color-stop(0.9, #dcdcdc), to(#8c8c8c) );
            border: 1px solid #989898;
            border-radius: 8px;
          }
          .speech::before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            left: 15px;
            top: -20px;
            border: 10px solid;
            border-color: transparent transparent #989898 transparent;
          }
          .speech::after {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            left: 17px;
            top: -16px;
            border: 8px solid;
            border-color: transparent transparent #ffffff transparent;
          }
          .left-chat {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            text-align: left;
            .chat-avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 5px;
            }
            .chat-info {
              flex:1;
              .line1 {
                color: rgb(141, 139, 139);
                font-size: 12px;
              }
              .line2 {
                display: flex;
                .chat-content {
                  color: #fff;
                  box-shadow: 2px 2px 5px royalblue;
                  margin-left: 0px;
                  position: relative;
                  background: linear-gradient(45deg, royalblue, #63B8FF);
                  &::before {
                    top: 9px;
                    bottom: auto;
                    left: -0px;
                    border-width: 9px 10px 9px 0;
                    border-color: transparent royalblue;
                  }
                  &::after {
                    top: 10px;
                    bottom: auto;
                    left: -8px;
                    border-width: 8px 9px 8px 0;
                    border-color: transparent royalblue;
                  }
                }
              }
            }
          }
          .right-chat {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            text-align: right;
            .chat-avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-left: 5px;
            }
            .chat-info {
              flex:1;
              .line1 {
                color: rgb(141, 139, 139);
                font-size: 12px;
              }
              .line2 {
                display: flex;
                justify-content:flex-end;
                .chat-content {
                  box-shadow: -2px 2px 5px #99BF40;
                  margin-right: 0px;
                  background: linear-gradient(45deg, #e4ffa7, #bced50);
                  &::before {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 0;
                    top: 9px;
                    bottom: auto;
                    left: auto;
                    right: -10px;
                    border-width: 9px 0 9px 10px;
                    border-color: transparent #989898;
                  }
                  &::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 0;
                    top: 10px;
                    bottom: auto;
                    left: auto;
                    right: -8px;
                    border-width: 8px 0 8px 9px;
                    border-color: transparent #bced50;
                  }
                }
              }
            }
          }
        }
      }
    }
    .page-consult-detail--input-conatiner {
      width: 100%;
      background: #63B8FF;
      height: 50px;
      padding: 5px 10px;
      display: flex;
      border: 1px solid #eee;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
      .page-consult-detail--input-code {
        height: 30px;
        background: #fff;
        display: block;
        border-radius: 10px;
        border: 1px solid #eee;
        flex: 1;
        padding: 5px 10px;
      }
      .page-consult-detail--submit-btn {
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
</style>
