<template>
  <section class="page-knowledge-add-or-edit">
    <g-noresult
    v-if="knowledgeId && !knowledgeInfo.id"
    :show="true"
    :knowledge="'未能查到知识库~'">
    </g-noresult>      
    <form @submit="formSubmit" v-else>
      <div class="zan-panel">
        <zan-field v-bind="Object.assign({}, handleFunctions, base.title)" :value="knowledgeInfo.title" :focus="curComponentId === base.title.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.desc)" :value="knowledgeInfo.desc" :focus="curComponentId === base.desc.componentId"/>
        <div class="good-at">类型：</div>
        <checkbox-group class="tag-list" @change="checkboxChange($event)" v-if="userType === '2'">
          <label class="tag-list-item" v-for="(item, index) in base.tagList" :key="index">
            <checkbox class="checkbox" :value="item.name" :checked="item.checked" />
            <span class="checkbox-value">{{item.value}}</span>
          </label>
        </checkbox-group>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.content)" :value="knowledgeInfo.content" v-if="userType === '2'" :focus="curComponentId === base.content.componentId"/>
      </div>
      <div class="zan-btns">
        <button class="zan-btn submit-btn" formType="submit">提交</button>
      </div>
    </form>
  </section>
</template>
<script>
import ZanField from '@/components/zan/field'
import GNoresult from '@/components/g-noresult/index.vue'
import api from '@/api'
export default {
  components: {
    ZanField,
    GNoresult
  },
  data () {
    return {
      title: '',
      knowledgeId: '',
      knowledgeInfo: {},
      curComponentId: '',
      base: {
        title: {
          title: '标题：',
          placeholder: '请输入不超过15个字的标题',
          componentId: 'title'
        },
        desc: {
          title: '简述：',
          placeholder: '请输入不超过30字的简述',
          componentId: 'desc'
        },
        content: {
          title: '内容：',
          type: 'textarea',
          placeholder: '请输入内容',
          componentId: 'content'
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
    this.knowledgeId = options.id
    if (this.knowledgeId) { // 编辑知识库
      this.getKnowledgeById()
    }
  },
  methods: {
    async getKnowledgeById () {
      await api.knowledge.getKnowledgeDetailById({
        id: this.knowledgeId
      }).then(res => {
        this.knowledgeInfo = res || {}
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.knowledgeInfo = {
        id: '3333',
        title: '剪短发放假撒开了房间',
        desc: '代付款撒娇的风口浪尖是否考虑是否就说了放假快乐风',
        content: '发健康的萨拉飞机父级的雷克萨福建省家乐福科技打法是否三答困了就睡考虑发动机开始罗芬接待室里开发及两地分居阿拉水电费垃圾堆里撒发快递'
      }
    },
    handleZanFieldChange (e) {
      const { componentId, target } = e
      this.knowledgeInfo[componentId] = target.value
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
    async submitEdit () {
      await api.knowledgeBase.updateKnowledge(submitInfo).then(res => {
        if (res) {
          this.$toast('提交成功！')
        }
      }).catch(err => {
        console.log(err)
        this.$toast('系统错误！')
      })
    }
    async submitAdd () {
      let that = this
      wx.showModal({
        content: '确定添加？',
        showCancel: true, // 是否显示取消按钮
        cancelColor: 'skyblue', // 取消文字的颜色
        confirmColor: 'skyblue', // 确定文字的颜色
        success: async function (res) {
          if (res.cancel) {
            // 点击取消,默认隐藏弹框
          } else {
            // 点击确定
            await api.knowledgeBase.addKnowledge(submitInfo).then(res => {
              if (res) {
                that.$toast('提交成功！')
              }
            }).catch(err => {
              console.log(err)
              that.$toast('提交失败！')
            })
          }
        }
      })
    },
    formSubmit (event) {
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
      if (this.knowledgeId) { // 修改知识库
        this.submitEdit()
      } else { // 添加知识库
        this.submitAdd()
      }     
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: this.title
    })
  }
}
</script>

<style lang="less">
.page-knowledge-add-or-edit {
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
