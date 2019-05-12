<template>
  <section class="page-my-detail">
    <form @submit="formSubmit">
      <div class="zan-panel">
        <zan-field v-bind="Object.assign({}, handleFunctions, base.nickName)" :value="userInfo.nickName" :focus="curComponentId === base.nickName.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.name)" :value="userInfo.name" :focus="curComponentId === base.name.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.academicTitle)" :value="userInfo.academicTitle" v-if="userType === '2'" :focus="curComponentId === base.academicTitle.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.phone)"  :value="userInfo.phone" :focus="curComponentId === base.phone.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.organization)" :value="userInfo.organization" v-if="userType !== '3'" :focus="curComponentId === base.organization.componentId"/>
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
        phone: {
          // focus: false,
          title: '联系电话：',
          inputType: 'number',
          placeholder: '请输入手机号',
          componentId: 'phone'
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
          title: this.userType === '2' ? '工作单位：' : '学校名称：',
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
    this.userType = this.$app.globalData.userType || ''
  },
  methods: {
    async getUserInfo () {
      await api.common.getUserInfo({
        userType: this.userType
      }).then(res => {
        this.userInfo = res || {}
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.userInfo = {
        avatar: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1293892983,611103898&fm=27&gp=0.jpg',
        nickName: '驾辕的位置',
        phone: '15868157426',
        name: '梁晓莹',
        academicTitle: '心理老师',
        organization: '浙江科技学院',
        detail: '发健康的萨拉飞机父级的雷克萨福建省家乐福科技打法是否三答困了就睡考虑发动机开始罗芬接待室里开发及两地分居阿拉水电费垃圾堆里撒发快递'
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
    async formSubmit (event) {
      let submitInfo = Object.assign({}, event.target.value, {tagList: this.tagList})
      for (const key in submitInfo) {
        if (submitInfo.hasOwnProperty(key)) {
          const element = submitInfo[key]
          if (!element || !element.length) {
            this.$toast('信息不可为空！')
            return false
          }
        }
      }
      await api.my.submitUserInfo(submitInfo).then(res => {
        if (res) {
          this.$toast('提交成功！')
        }
      }).catch(err => {
        console.log(err)
        this.$toast('系统错误！')
      })
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '我的资料'
    })
    this.getUserInfo()
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
