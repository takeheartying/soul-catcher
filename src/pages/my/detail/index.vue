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
        <zan-field v-bind="Object.assign({}, handleFunctions, base.relationPhone)"  :value="userInfo.relationPhone" v-if="userType === '1' || userType === '3'" :focus="curComponentId === base.relationPhone.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.organization)" :value="userInfo.organization" v-if="userType === '1' || userType === '2'" :focus="curComponentId === base.organization.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.detail)" :value="userInfo.detail" v-if="userType === '2'" :focus="curComponentId === base.detail.componentId"/>
        <div class="good-at" v-if="userType === '2'">擅长领域：</div>
        <checkbox-group class="tag-list" @change="checkboxChange($event)" v-if="userType === '2'">
          <label class="tag-list-item" v-for="(item, index) in base.tagList" :key="index">
            <checkbox class="checkbox" :value="item.name" :checked="item.checked" />
            <span class="checkbox-value">{{item.value}}</span>
          </label>
        </checkbox-group>
      </div>
      <div class="zan-btns">
        <button class="zan-btn submit-btn" formType="submit">提交</button>
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
            value: '心理综合',
            checked: false
          },
          {
            name: '4',
            value: '智商情商',
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
  onLoad (options) {
    if (options.userType) { // 未登录---用户注册，url传参
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
      await api.common.getUserInfo({
        userType: this.userType,
        userId: this.$app.globalData.userInfo.userId
      }).then(res => {
        this.userInfo = res || {}
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.userInfo = {
        userType: '1',
        avatar: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1293892983,611103898&fm=27&gp=0.jpg',
        nickName: '驾辕的位置',
        phone: '15868157426',
        name: '梁晓莹',
        relationPhone: '15869702839',
        academicTitle: '心理老师',
        organization: '浙江科技学院',
        detail: '发健康的萨拉飞机父级的雷克萨福建省家乐福科技打法是否三答困了就睡考虑发动机开始罗芬接待室里开发及两地分居阿拉水电费垃圾堆里撒发快递'
      }
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
    checkboxChange (e) {
      this.tagList = e.target.value
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
          phone: e.target.value.phone,
          relationPhone: e.target.value.relationPhone
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
      if (this.userInfo && this.userInfo._id) {
        this.updateUser(submitInfo)
      } else {
        this.addUser(submitInfo)
      }
    },
    async addUser (submitInfo) {
      await api.my.register(submitInfo).then(res => {
        if (res) {
          this.$toast('注册成功！')
          // 前往个人中心主页：
          wx.reLaunch({url: `/pages/my/personal-center/main`})
        }
      }).catch(err => {
        console.log(err)
        this.$toast('抱歉，系统错误！')
      })
    },
    async updateUser (submitInfo) {
      await api.my.updateUserInfo(submitInfo).then(res => {
        if (res) {
          this.$toast('修改成功！')
          // 前往个人中心主页：
          wx.reLaunch({url: `/pages/my/personal-center/main`})
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
