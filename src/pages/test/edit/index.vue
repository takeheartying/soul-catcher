<template>
  <section class="page-test-add-or-edit">
    <g-loading :loading="loading"></g-loading>
    <g-noresult
    v-if="!loading && testId && !testInfo.id"
    :show="testId && !testInfo.id"
    :message="'未能查到测试题~'">
    </g-noresult>
    <form @submit="formSubmit" v-if="!loading && (!testId || testInfo.id)">
      <div class="zan-panel">
        <div class="upload-img-warp">
          <div class="upload-label">图片：</div>
          <i class="iconfont icon-shangchuan" @click="chooseImage()" v-if="(!picUrl && !testInfo.picUrl)"></i>
          <image class="upload-image" :src="picUrl || testInfo.picUrl" v-if="picUrl || testInfo.picUrl" @click="chooseImage()" mode="aspectFill"></image>
        </div>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.title)" :value="testInfo.title" :focus="curComponentId === base.title.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.desc)" :value="testInfo.desc" :focus="curComponentId === base.desc.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.detail)" :value="testInfo.detail" :focus="curComponentId === base.detail.componentId"/>
        <div class="good-at">类型：</div>
        <radio-group class="tag-list" @change="radioChange($event)">
          <label class="tag-list-item" v-for="(item, index) in base.tagList" :key="index">
            <radio class="radio" :value="item.name" :checked="tagType === item.name || item.checked" />
            <span class="radio-value">{{item.value}}</span>
          </label>
        </radio-group>
        <!-- 测试题： -->
        <div class="questions-wrap">
          <div class="question-label">测试题：</div>
          <ul class="question-list">
            <li class="question-list-item" v-for="(question, questionIndex) in testInfo.examList" :key="questionIndex">
              <div class="question-list-title-wrap">
                <span class="index">{{questionIndex + 1}}、</span>
                <input class="title" placeholder="请输入标题" v-model="question.questionTitle" :disabled="noEdit"/>
                <!-- 添加测试选项： -->
                <i class="option-add iconfont icon-tianjia" @click="addOption(question, questionIndex)" v-if="!noEdit"></i>
                <!-- 删除测试题 -->
                <i class="question-delete iconfont icon-shanchu3-copy" @click="deleteQuestion(questionIndex)" v-if="!noEdit"></i>
              </div>
              <ul class="options">
                <li class="option-item-wrap" v-for="(option, optionIndex) in question.options" :key="optionIndex">
                  <span class="index">{{optionIndex + 1}}.</span>
                  <div class="option-item">
                    <input class="option-item-input" placeholder="请输入选择项" v-model="option.content" :disabled="noEdit"/>
                    <input class="option-item-input score"  placeholder="请输入心理健康程度分 0-10分" maxlength="2" type="number" min="1" max="10" v-model="option.score" :disabled="noEdit"/>
                  </div>
                  <!-- 删除测试选项 -->
                  <i class="option-delete iconfont icon-shanchu3-copy" @click="deleteOption(question, questionIndex, optionIndex)" v-if="!noEdit"></i>
                </li>
              </ul>

            </li>
          </ul>
          <!-- 添加测试题： -->
          <button class="question-add" @click="addQuestion()" v-if="!noEdit">添加测试题</button>
        </div>

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
import GLoading from '@/components/g-loading/index.vue'
import api from '@/api'
export default {
  components: {
    ZanField,
    GNoresult,
    GLoading
  },
  data () {
    return {
      noEdit: '', // '1': 不可编辑【测试被人测过之后不可编辑测试题】
      loading: false,
      picUrl: '',
      title: '',
      testId: '',
      testInfo: {
        picUrl: '',
        title: '',
        desc: '',
        detail: '',
        tagType: '', // 1爱情脱单 2智商情商 3趣味性格 4心理综合
        tagTypeDesc: '',
        testNum: 0,
        id: '',
        examList: []
      },
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
        detail: {
          title: '详情：',
          type: 'textarea',
          placeholder: '请输入描述详情',
          componentId: 'detail'
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
      tagType: '',
      userType: '' // 0 管理员 1 学生 2 专家 3 家长
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.testId = options.id
    this.noEdit = options.noEdit === '1' // 当测试被人测过之后，就不可编辑了
    // 初始数据置空：
    this.initData()
    if (this.testId) { // 编辑测试
      this.getTestById()
    }
  },
  methods: {
    async upload (file) { // 上传单张图片
      const tempFiles = file.tempFiles
      const path = tempFiles[0].path
      const size = tempFiles[0].size
      if (size > 2 * 1024 * 1024) {
        this.$toast('请上传小于2M的图片')
        return
      }
      this.$loading.show('正在上传')
      await api.upload({
        url: '/kanoupload/imageupload.json', // 上传的地址
        path: path,
        name: 'testPic'
      }).then(res => {
        if (res) {
          console.log('上传成功！')
        }
      }).catch(err => {
        console.log(err)
        this.$toast('上传失败！')
      })
      this.$loading.hide()
    },
    chooseImage () { // 图片上传
      let that = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          that.picUrl = res.tempFilePaths[0]
          // 上传图片：
          that.upload(res)
        }
      })
    },
    async getTestById () {
      this.loading = true
      await api.test.getTestDetailInfoById({
        id: this.testId
      }).then(res => {
        this.testInfo = res
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      let res = {
        picUrl: 'http://img3.imgtn.bdimg.com/it/u=2870322368,453611869&fm=26&gp=0.jpg',
        title: '从积极心理学到幸福感',
        desc: '心境由心而设，态度可以决定我们的生活',
        detail: '围殴减肥的空间打发时间爱发科的结论是开饭啦司法解释口岸疯狂夺金萨福克精神科拉飞机拉萨九分裤大富科技按时付款了贷款酸辣粉东方健康路撒放开了的附件安联大厦积分卡斯加咖啡拉萨到付款荆防颗粒三加上端口分类考试了',
        tagType: '4', // 1爱情脱单 2智商情商 3趣味性格 4心理综合
        tagTypeDesc: '心理综合',
        testNum: 111,
        id: '111',
        examList: [ // 测试题目列表
          {
            questionTitle: '你曾经想要成为小说家或者词作者吗？',
            questionId: '22333',
            options: [
              {
                content: '想过',
                score: 7 // 心理健康积分
              },
              {
                content: '从没想过',
                score: 8
              }
            ]
          },
          {
            questionTitle: '学生时代，在文艺汇演时，你基本都是主角？',
            questionId: '33323',
            options: [
              {
                content: '是的',
                score: 7 // 心理健康积分
              },
              {
                content: '没有，我一般低调',
                score: 8
              }
            ]
          },
          {
            questionTitle: '你一次都没有被异性追过？',
            questionId: '654756',
            options: [
              {
                content: '是的',
                score: 7 // 心理健康积分
              },
              {
                content: '当然不是',
                score: 8
              }
            ]
          },
          {
            questionTitle: '舞会前，你会积极调查即将出席的异性情况？',
            questionId: '454354',
            options: [
              {
                content: '是的',
                score: 7 // 心理健康积分
              },
              {
                content: '不会的呀呀呀呀呀呀呀呀呀晕晕晕晕晕晕晕呀呀呀呀呀呀晕晕晕晕晕晕晕晕晕晕晕晕晕晕晕晕晕晕嘤嘤嘤嘤嘤嘤嘤',
                score: 9.0
              }
            ]
          }
        ]
      }
      this.testInfo = res
      this.setData()

      this.loading = false
    },
    setData () {
      // 数据绑定：
      if (this.testInfo && this.testInfo.tagType) { // 初始设置radio的值
        let index = Number(this.testInfo.tagType) - 1
        if (this.base.tagList[index]) {
          this.base.tagList[index].checked = true
          this.tagType = this.testInfo.tagType
        }
      }
      this.picUrl = this.testInfo.picUrl || '' // 初始设置picUrl
    },
    initData () { // 初始置空
      this.testInfo = {
        picUrl: '',
        title: '',
        desc: '',
        detail: '',
        tagType: '', // 1爱情脱单 2智商情商 3趣味性格 4心理综合
        tagTypeDesc: '',
        testNum: 0,
        id: '',
        examList: []
      }
    },
    addQuestion () { // 添加测试题
      this.testInfo.examList = this.testInfo.examList.concat({
        questionTitle: '',
        questionId: '',
        options: [
          {
            content: '',
            score: '' // 心理健康积分
          },
          {
            content: '',
            score: ''
          }
        ]
      })
    },
    addOption (question, questionIndex) { // 添加测试选项
      if (this.testInfo && this.testInfo.examList && this.testInfo.examList[questionIndex]) {
        question.options.push({
          content: '',
          score: ''
        })
        let newExamList = [].concat(this.testInfo.examList)
        newExamList.splice(questionIndex, 1, question)
        this.testInfo.examList = newExamList
      }
    },
    deleteQuestion (questionIndex) { // 删除测试题
      let that = this
      wx.showModal({
        content: '确定要删除测试题？',
        showCancel: true, // 是否显示取消按钮
        cancelColor: 'skyblue', // 取消文字的颜色
        confirmColor: 'skyblue', // 确定文字的颜色
        success: async function (res) {
          if (res.cancel) {
            // 点击取消,默认隐藏弹框
          } else {
            // 点击确定
            that.testInfo.examList.splice(questionIndex, 1)
            that.testInfo.examList = [...that.testInfo.examList]
          }
        }
      })
    },
    deleteOption (question, questionIndex, optionIndex) { // 删除测试题选项
      let that = this
      wx.showModal({
        content: '确定要删除测试题选项？',
        showCancel: true, // 是否显示取消按钮
        cancelColor: 'skyblue', // 取消文字的颜色
        confirmColor: 'skyblue', // 确定文字的颜色
        success: async function (res) {
          if (res.cancel) {
            // 点击取消,默认隐藏弹框
          } else {
            // 点击确定
            let newExamList = [].concat(that.testInfo.examList)
            newExamList[questionIndex].options.splice(optionIndex, 1)
            that.testInfo.examList = newExamList
          }
        }
      })
    },
    handleZanFieldChange (e) {
      const { componentId, target } = e
      this.testInfo[componentId] = target.value
    },
    handleZanFieldFocus (e) {
      this.curComponentId = e.componentId
    },
    handleZanFieldBlur (e) {
      this.curComponentId = ''
    },
    radioChange (e) {
      this.tagType = e.target.value
    },
    async submitEdit (submitInfo) {
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
            await api.test.updateTest(submitInfo).then(res => {
              if (res) {
                this.$toast('提交成功！')
              }
            }).catch(err => {
              console.log(err)
              this.$toast('系统错误！')
            })
          }
        }
      })
    },
    async submitAdd (submitInfo) {
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
            await api.test.addTest(submitInfo).then(res => {
              if (res) {
                that.$toast('提交成功！')
              }
            }).catch(err => {
              console.log(err)
              that.$toast('系统错误！')
            })
          }
        }
      })
    },
    formSubmit (event) {
      let submitInfo = this.testInfo
      let BreakException = {}
      let cancelFlag = false
      for (const key in submitInfo) {
        if (submitInfo.hasOwnProperty(key)) {
          const element = submitInfo[key]
          if ((key !== 'testNum' && (!element || !element.length))) { // 跳过testNum属性
            this.$toast('信息不可为空！')
            cancelFlag = true
            return false
          }
          if (key === 'examList') {
            try {
              element.forEach(question => {
                if (!question.questionTitle) {
                  this.$toast('标题不可为空！')
                  throw BreakException
                }
                if (!question.options || question.options.length < 2) {
                  this.$toast('测试选项数要大于等于2！')
                  throw BreakException
                }
                if (!question.options || question.options.length < 2) {
                  this.$toast('测试选项数要大于等于2！')
                  throw BreakException
                }
                question.options.forEach(option => {
                  if (!option.content || !option.score) {
                    this.$toast('测试选项不可为空！')
                    throw BreakException
                  }
                  if (isNaN(Number(option.score))) {
                    this.$toast('请输入正确的测试分数！')
                    throw BreakException
                  }
                  if (Number(option.score) < 0 || (Number(option.score) > 10)) {
                    this.$toast('请输入0-10的测试分数！')
                    throw BreakException
                  }
                })
              })
            } catch (e) {
              if (e === BreakException) {
                cancelFlag = true
              }
            }
          }
        }
      }
      if (cancelFlag) {
        return false
      }
      if (this.testId) { // 修改测试
        this.submitEdit(submitInfo)
      } else { // 添加测试
        this.submitAdd(submitInfo)
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
.page-test-add-or-edit {
  overflow: auto;
  background: #fff;
  .submit-btn {
    background: #63B8FF;
  }
  .good-at {
    padding: 15px 0 0 20px;
    font-size: 16px;
  }
  .upload-img-warp {
    display: flex;
    flex-direction: row;
    align-items: center;
    .upload-label {
      padding: 15px 0 0 20px;
      font-size: 16px;
    }
    .upload-image {
      width: 90px;
      height: 70px;
      border-radius: 3px;
      padding-top: 20px;
      padding-left: 40px;
    }
    .iconfont {
      color: #63B8FF;
    font-size: 60px;
      left: 31px;
      position: relative;
      top: 10px;
    }
  }
  .tag-list {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 15px 0;
    .tag-list-item {
      .radio-value {
        margin-left: -3px;
      }
      .radio {
        transform: scale(0.5);
        position: relative;
        top: -1.5px;
      }
    }
  }
  .questions-wrap {
    .question-label {
      border-top: 0.5px solid #eee;
      margin: 15px 15px 15px 20px;
      font-size: 16px;
      padding-top: 15px;
    }
    .question-list {
      padding:0 20px;
      font-size:14px;
      .question-list-item {
        margin-bottom: 10px;
        .question-list-title-wrap {
          font-weight: bold;
          display: flex;
          flex-direction: row;
          align-items: center;
          span.index {
            width: 20px;
          }
          .title {
            border: 0.5px solid #eee;
            padding: 5px 10px;
            flex: 1;
          }
          i {
            font-size: 24px;
            color: #63B8FF;
            display: block;
          }
          i.question-delete {
            margin-left: 5px;
          }
          i.option-add {
            margin-left: 5px;
          }
        }
        .options {
          padding: 10px;
          .option-item-wrap {
            display: flex;
            flex-direction: row;
            align-items: center;
            position: relative;
            margin-right: 50px;
            margin-left: 10px;
            span.index {
              width: 20px;
              font-weight: bold;
              position: absolute;
              top: 10px;
              left: -10px;
            }
            .option-item {
              flex: 1;
              margin-bottom: 10px;
              margin-left: 10px;
              input {
                border: 0.5px solid #eee;
                padding: 5px 10px;
              }
              input.score {
                margin: 10px 0;
              }
            }
            i {
              font-size: 20px;
              color: #63B8FF;
              display: block;
              margin-left: 10px;
              position: absolute;
              top: 0px;
              right: -25px;
              padding: 5px 0;
            }
          }
        }
      }
    }
    .question-add {
      width: 120px;
      padding: 4px 10px;
      background: #63B8FF;
      font-size: 16px;
      color: #fff;
      margin-bottom: 10px;
    }
  }
}
</style>
