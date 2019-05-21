<template>
  <section class="page-test-add-or-edit">
    <g-loading :loading="loading"></g-loading>
    <g-noresult
    v-if="!loading && testId && !testInfo._id"
    :show="testId && !testInfo._id"
    :message="'未能查到测试题~'">
    </g-noresult>
    <form @submit="formSubmit" v-if="!loading && (!testId || testInfo._id)">
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
      title: '',
      noEdit: '', // '1': 不可编辑【测试被人测过之后不可编辑测试题】
      file: {}, // 上传的临时文件
      loading: false,
      originPic: '', // 原有图片，用于删除
      picUrl: '',
      testId: '',
      testInfo: {
        picUrl: '',
        title: '',
        desc: '',
        detail: '',
        tagType: '', // 1爱情脱单 2智商情商 3趣味性格 4心理综合
        tagTypeDesc: '',
        testorNum: 0,
        _id: '',
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
  watch: {
    testId () {
      this.title = this.testId ? '编辑测试题' : '添加测试题'
      wx.setNavigationBarTitle({
        title: this.title || '测试详情'
      })
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.testId = options.id
    this.noEdit = options.noEdit === '1' // 当测试被人测过之后，就不可编辑了
    // 初始数据置空：
    this.initData()
    this.title = this.testId ? '编辑测试题' : '添加测试题'
    if (this.testId) { // 编辑测试
      this.getTestById()
    }
  },
  methods: {
    upload (res) { // 上传单张图片
      let uploadParams = {}
      if (res && res.tempFilePaths) {
        const filePath = res.tempFilePaths[0]
        uploadParams = {
          filePath
        }
      }
      return uploadParams
    },
    chooseImage () { // 图片上传
      let that = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          // 存储临时路径 -- 提交之后再上传图片：
          const size = res.tempFiles[0].size
          if (size > 2 * 1024 * 1024) {
            that.$toast('请上传小于2M的图片')
            return false
          }
          that.testInfo.picUrl = that.picUrl = res.tempFilePaths[0]
          that.file = res
        }
      })
    },
    async getTestById () {
      this.loading = true
      await api.test.getTestDetailInfoById({
        _id: this.testId
      }).then(res => {
        if (res && res.data) {
          this.testInfo = res.data || {}
          this.originPic = this.testInfo.picUrl || ''
        } else {
          this.$toast(res.message || '系统出错')
        }
      }).catch(err => {
        console.log(err)
      })

      this.loading = false
      this.setData()
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
        testorNum: 0,
        _id: '',
        examList: []
      }
    },
    addQuestion () { // 添加测试题
      this.testInfo.examList = this.testInfo.examList.concat({
        questionTitle: '',
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
      this.testInfo.tagType = this.tagType = e.target.value
    },
    async submitEdit (submitInfo) {
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
            // 点击确定 -- 上传图片并存储
            await api.test.updateTest(submitInfo).then(res => {
              if (res && res.code === '0') {
                if (res.picUrl) { // 更改了图片
                  that.originPic = res.picUrl // 存储原来的图片后用于删除
                  that.picUrl = res.picUrl // 替换临时图片url 为 服务器的图片url
                }
                that.$toast(res.message || '修改成功！')
                return false
              }
              if (res && res.code === '-1') {
                that.$toast(res.message || '修改失败！')
                return false
              }
            })
          }
        }
      })
    },
    async submitAdd (submitInfo) {
      if (!submitInfo.uploadParams.filePath) {
        this.$toast('请上传图片！')
      }
      submitInfo.userId = this.$app.globalData.userInfo.userId
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
            // 点击确定 -- 上传图片并存储
            await api.test.addTest(submitInfo).then(res => {
              if (res && res.code === '0' && res.data && res.data._id) {
                if (res.data.picUrl) {
                  that.originPic = res.data.picUrl // 存储原来的图片后用于删除
                  that.picUrl = res.data.picUrl // 替换临时图片url 为 服务器的图片url
                }
                that.testInfo._id = res.data._id
                that.testId = res.data._id
                that.$toast(res.message || '添加成功！')
                return false
              }
              if (res && res.code === '-1') {
                that.$toast(res.message || '添加失败！')
                return false
              }
            })
          }
        }
      })
    },
    formSubmit (event) {
      let uploadParams = this.upload(this.file)
      let submitInfo = this.testInfo
      let BreakException = {}
      let cancelFlag = false
      for (const key in submitInfo) {
        if (submitInfo.hasOwnProperty(key)) {
          const element = submitInfo[key]
          if ((key !== 'author' && key !== 'picUrl' && key !== 'testorNum' && key !== 'tagTypeDesc' && key !== 'uploadParams' && key !== '_id' && (!element || !element.length))) { // 跳过testorNum 和 tagTypeDesc等属性
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
      if (this.testId) {
        submitInfo._id = this.testId
      }
      if (uploadParams) {
        submitInfo.uploadParams = uploadParams
      }
      if (this.originPic) {
        submitInfo.originPic = this.originPic
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
      title: this.title || '测试详情'
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
