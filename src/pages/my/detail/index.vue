<template>
  <section class="page-my-detail">
    <form @submit="formSubmit">
      <div class="zan-panel">
        <zan-field v-bind="Object.assign({}, handleFunctions, base.nickName)" :value="userInfo.nickName" :focus="curComponentId === base.nickName.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.name)" :value="userInfo.name" :focus="curComponentId === base.name.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.userName)" :value="userInfo.userName" :focus="curComponentId === base.userName.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.password)" :value="userInfo.password" :focus="curComponentId === base.password.componentId"/>

        <zan-field v-bind="Object.assign({}, handleFunctions, base.academicTitle)" :value="userInfo.academicTitle" v-if="userType === '2'" :focus="curComponentId === base.academicTitle.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.phone)"  :value="userInfo.phone" v-if="userType !== '0'" :focus="curComponentId === base.phone.componentId"/>
        <!-- 亲属只能由家长来添加： -->
        <zan-field v-bind="Object.assign({}, handleFunctions, base.relationPhone)"  :value="userInfo.relationship && userInfo.relationship.phone" v-if="userType === '3'" :focus="curComponentId === base.relationPhone.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.organization)" :value="userInfo.organization" v-if="userType === '1' || userType === '2'" :focus="curComponentId === base.organization.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.detail)" :value="userInfo.detail" v-if="userType === '2'" :focus="curComponentId === base.detail.componentId"/>
        <div class="good-at" v-if="userType === '2'">擅长领域：</div>
        <checkbox-group class="tag-list" @change="checkboxChange($event)" v-if="userType === '2'">
          <label class="tag-list-item" v-for="(item, index) in base.tagList" :key="index">
            <checkbox class="checkbox" @click="clickCheckBox(item, index)" :value="item.name" :checked="item.checked" />
            <span class="checkbox-value">{{item.value}}</span>
          </label>
        </checkbox-group>
      </div>
      <div class="zan-btns">
        <button class="zan-btn submit-btn" formType="submit">提交</button>
        <button class="zan-btn submit-btn" @click="loginOut()">退登</button>
      </div>
    </form>
  </section>
</template>
<script>
import ZanField from '@/components/zan/field'
import api from '@/api'
export default {
  components: {
    ZanField
  },
  data () {
    return {
      userInfo: {},
      curComponentId: '',
      base: {
        nickName: {
          // focus: false,
          title: '昵称：',
          placeholder: '请输入昵称',
          componentId: 'nickName'
        },
        name: {
          // focus: false,
          title: '姓名：',
          placeholder: '请输入姓名',
          componentId: 'name'
        },
        userName: {
          // focus: false,
          title: '用户名：',
          placeholder: '请输入用户名',
          componentId: 'userName'
        },
        password: {
          type: 'password',
          title: '密码：',
          placeholder: '请输入密码',
          componentId: 'password'
        },
        phone: {
          // focus: false,
          title: '联系电话：',
          inputType: 'number',
          placeholder: '请输入手机号',
          componentId: 'phone'
        },
        relationPhone: {
          // focus: false,
          title: '学生电话',
          inputType: 'number',
          placeholder: '请输入手机号',
          componentId: 'relationPhone'
        },
        academicTitle: {
          // focus: false,
          title: '职称：',
          placeholder: '请输入职称',
          componentId: 'academicTitle'
        },
        detail: {
          // focus: false,
          title: '详细介绍：',
          type: 'textarea',
          placeholder: '请输入详细介绍',
          componentId: 'detail'
        },
        organization: {
          // focus: false,
          title: '学校名称：',
          placeholder: '请输入学校名称',
          componentId: 'organization'
        },
        tagList: [
          {
            name: '1',
            value: '爱情脱单',
            checked: false
          },
          {
            name: '2',
            value: '智商情商',
            checked: false
          },
          {
            name: '3',
            value: '趣味性格',
            checked: false
          },
          {
            name: '4',
            value: '心理综合',
            checked: false
          }
        ]
      },
      handleFunctions: {
        handleZanFieldFocus: this.handleZanFieldFocus,
        handleZanFieldBlur: this.handleZanFieldBlur,
        handleZanFieldChange: this.handleZanFieldChange
      },
      tagList: [], // '1' '2' '3' '4'
      userType: '' // 0 管理员 1 学生 2 专家 3 家长
    }
  },
  onUnload () {
    // 解决页面返回后，数据没重置的问题
    Object.assign(this.$data, this.$options.data())
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    if (options.userType) { // 未登录---用户注册，选择角色后--url传参
      this.userType = options.userType
    } else { // 已登录
      this.userType = this.$app.globalData.userType || ''
      this.getUserInfo()
    }
    this.initData()
  },
  methods: {
    // 登录检测：
    async getUserInfo () {
      await api.user.getUserInfo({
        userId: this.$app.globalData.userInfo.userId
      }).then(res => {
        this.userInfo = res.data || {}
      }).then(res => {
        // 初始处理tagList:
        if (this.userInfo && this.userInfo.tagList) {
          this.userInfo.tagList.forEach((tag) => {
            if (typeof tag === 'string') {
              let tagIndex = Number(tag) - 1
              this.base.tagList[tagIndex].checked = true
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    initData () {
      this.base.relationPhone.title = this.userType === '3' ? '孩子电话：' : '家长电话：'
      this.base.organization = {
        title: this.userType === '2' ? '工作单位：' : '学校名称：',
        placeholder: this.userType === '2' ? '请输入工作单位' : '请输入学校名称',
        componentId: 'organization'
      }
    },
    handleZanFieldChange (e) {
      const { componentId, target } = e
      this.userInfo[componentId] = target.value
    },
    handleZanFieldFocus (e) {
      this.curComponentId = e.componentId
    },
    handleZanFieldBlur (e) {
      this.curComponentId = ''
    },
    clickCheckBox (tag, tagIndex) {
      this.base.tagList[tagIndex].checked = !this.base.tagList[tagIndex].checked
    },
    checkboxChange (e) {
      this.tagList = e.target.value
    },
    loginOut () { // 退出登录
      let that = this
      wx.showModal({
        content: '确定提交？',
        showCancel: true, // 是否显示取消按钮
        cancelColor: 'skyblue', // 取消文字的颜色
        confirmColor: 'skyblue', // 确定文字的颜色
        success: async res => {
          if (res.cancel) {
            // 点击取消,默认隐藏弹框
          } else {
            // 点击确定
            that.$app.globalData.userType = ''
            that.$app.globalData.loginState = 'noLogin'
            that.$app.globalData.userInfo = {}
            wx.reLaunch({url: `/pages/home/main`})
            wx.showTabBar()
          }
        }
      })
    },
    formSubmit (e) {
      let submitInfo = {}
      if (this.userType === '0') {
        submitInfo = {
          nickName: e.target.value.nickName,
          name: e.target.value.name,
          userName: e.target.value.userName,
          password: e.target.value.password
        }
      }
      if (this.userType === '1') {
        submitInfo = {
          name: e.target.value.name,
          nickName: e.target.value.nickName,
          userName: e.target.value.userName,
          password: e.target.value.password,
          organization: e.target.value.organization,
          phone: e.target.value.phone
        }
      }
      if (this.userType === '2') {
        submitInfo = Object.assign({}, e.target.value, {tagList: this.tagList})
      }
      if (this.userType === '3') {
        submitInfo = {
          name: e.target.value.name,
          nickName: e.target.value.nickName,
          userName: e.target.value.userName,
          password: e.target.value.password,
          phone: e.target.value.phone,
          relationPhone: e.target.value.relationPhone
        }
      }
      for (const key in submitInfo) {
        if (submitInfo.hasOwnProperty(key)) {
          const element = submitInfo[key]
          if (!element || !element.length) {
            this.$toast('信息不可为空！')
            return false
          }
        }
      }
      if (this.$app.globalData.userInfo && this.$app.globalData.userInfo.avatarUrl) {
        submitInfo.avatarUrl = this.$app.globalData.userInfo.avatarUrl
      }
      if (this.userInfo && this.userInfo._id) {
        this.updateUser(submitInfo)
      } else {
        this.addUser(submitInfo)
      }
    },
    async addUser (submitInfo) {
      submitInfo.userType = this.userType
      await api.user.register(submitInfo).then(res => {
        if (res && res.data && res.data.userId) {
          // 设置全局数据：
          this.$app.globalData.loginState = 'done'
          this.$app.globalData.userInfo = {
            userId: res.data.userId,
            name: res.data.name,
            userName: res.data.userName,
            avatarUrl: res.data.avatarUrl,
            openId: res.data.openId,
            userType: res.data.userType
          }
          this.$app.globalData.userType = res.data.userType

          this.$toast('注册成功！')
          // 前往个人中心主页：
          wx.reLaunch({url: `/pages/my/personal-center/main`})
        } else {
          this.$toast(res.message || '注册失败！')
        }
      }).catch(err => {
        console.log(err)
        this.$toast('抱歉，系统错误！')
      })
    },
    async updateUser (submitInfo) {
      submitInfo.userType = this.$app.globalData.userInfo.userType
      submitInfo.userId = this.$app.globalData.userInfo.userId
      await api.user.updateUserInfo(submitInfo).then(res => {
        if (res && res.data && res.data.userId) {
          this.$app.globalData.userInfo = {
            userId: res.data.userId,
            name: res.data.name,
            userName: res.data.userName,
            avatarUrl: res.data.avatarUrl,
            openId: res.data.openId,
            userType: res.data.userType
          }
          this.$toast('修改成功！')
          // 前往个人中心主页：
          wx.reLaunch({url: `/pages/my/personal-center/main`})
        } else {
          this.$toast(res.message || '提交失败！')
        }
      }).catch(err => {
        console.log(err)
        this.$toast('抱歉，系统错误！')
      })
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '我的资料'
    })
  }
}
</script>

<style lang="less">
.page-my-detail {
  height: 100%;
  background: #fff;
  .submit-btn {
    background: #63B8FF;
  }
  .good-at {
    padding: 15px 0 0 20px;
    font-size: 16px;
  }
  .tag-list {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 15px 0;
    .tag-list-item {
      .checkbox-value {
        margin-left: -3px;
      }
      .checkbox {
        transform: scale(0.5);
        position: relative;
        top: -1.5px;
      }
    }
  }
}
</style>
