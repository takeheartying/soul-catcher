<template>
  <div class="page-test-detail">
    <!-- 心理测试详情页： -->
    <!-- 1.开始测试导引： -->
    <div class="page-test-detail--description" v-if="!hasStartTest && testInfo._id && !showResult">
      <div class="test-title">{{testInfo.title}}</div>
      <div class="test-num">{{testInfo.testorNum}}人测过</div>
      <image class="test-pic" mode="aspectFill" :src="testInfo.picUrl"></image>
      <ul class="test-info">
        <li class="test-info-item">
          <div class="test-info-item-title">类型：</div>
          <div class="test-info-item-content">{{testInfo.tagTypeDesc}}</div>
        </li>
        <li class="test-info-item">
          <div class="test-info-item-title">简述：</div>
          <div class="test-info-item-content">{{testInfo.desc}}</div>
        </li>
        <li class="test-info-item">
          <div class="test-info-item-title">详情：</div>
          <div class="test-info-item-content">{{testInfo.detail}}</div>
        </li>
      </ul>
      <button class="test-btn" open-type="share">分享测试</button>
      <button class="test-btn" @click="startTest()">开始测试</button>
    </div>
    <!-- 2.具体测试题目： -->
    <div class="page-test-detail--examination" v-if="hasStartTest && !showResult && testInfo.examList && testInfo.examList.length">
      <div class="page-test-detail--examination-container">
        <div class="page-test-detail--examination-item-wrap" v-for="(question, index) in testInfo.examList" :key="index">
          <li class="page-test-detail--examination-item" v-if="index === curIndex">
            <div class="page-test-detail--examination-item-title">{{index + 1}}、{{question.questionTitle}}</div>
            <div class="page-test-detail--examination-item-options">
              <radio-group class=""  @change="radioChange($event, question, index)" >
                <label class="page-test-detail--examination-item-option"  v-for="(option, optionIndex) in question.options" :key="optionIndex">
                  <radio class="radio" color="#63B8FF" :name="optionIndex" :value="optionIndex" :checked="question.answerIndex && Number(question.answerIndex) === optionIndex"></radio>
                  <p class="content">{{option.content}}</p>
                </label>
              </radio-group>
            </div>
            <div class="page-test-detail--examination-item-btns">
              <button class="page-test-detail--examination-item-btn" v-if="curIndex > 0 && curIndex < testInfo.examList.length" @click="clickLastQuestion()">上一题</button>
              <button class="page-test-detail--examination-item-btn" v-if="(curIndex + 1) === testInfo.examList.length" @click="submitExam()">提交</button>
            </div>
          </li>
        </div>
      </div>
      <div class="page-test-detail--examination-tip">
        {{curIndex + 1}}/{{testInfo.examList.length}}
      </div>
    </div>
    <!-- 3.展示结果： -->
    <div class="page-test-detail--result" v-if="showResult">
      <image class="page-test-detail--result-avatar" mode="aspectFill" :src="resultInfo.avatarUrl"></image>
      <div class="page-test-detail--result-score">
        <p class="title">你的心理状况</p>
        <p class="score">{{resultInfo.resultScore}}分</p>
      </div>
      <div class="page-test-detail--result-tip" v-if="resultInfo.resultScore < 40">当前心理状况不佳，建议向相关专家咨询哦~</div>
      <div class="page-test-detail--result-tip" v-if="resultInfo.resultScore >= 40 && resultInfo.resultScore < 80">当前心理状况良好，按需咨询哦~</div>
      <div class="page-test-detail--result-tip" v-if="resultInfo.resultScore >= 80">当前心理状况不错，继续保持哦~</div>
    </div>
  </div>
</template>
<script>
import api from '@/api'
export default {
  data () {
    return {
      resultInfo: {},
      showResult: false,
      hasStartTest: false,
      testId: '',
      curIndex: 0, // 当前测试题index
      testInfo: {
        id: ''
      }
    }
  },
  methods: {
    async getTestInfo () {
      if (!this.testId) return false
      await api.test.getTestDetailInfoById({
        _id: this.testId
      }).then(res => {
        if (res && res.data) {
          this.testInfo = res.data || {}
          debugger
        } else {
          this.$toast(res.message || '系统出错')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    startTest () { // 开始测试
      this.hasStartTest = true
    },
    radioChange (e, question, index) { // answerIndex 是指单个question选择的optionIndex
      if (e.target.value) {
        this.testInfo.examList[this.curIndex].answerIndex = e.target.value
      }
      if (this.curIndex + 1 < this.testInfo.examList.length) {
        this.curIndex++
      }
    },
    clickLastQuestion () { // 点击上一题
      // 这一题的选择清空：
      this.testInfo.examList[this.curIndex].answerIndex = ''
      this.curIndex--
      // 上一题的选择清空：
      this.testInfo.examList[this.curIndex].answerIndex = ''
    },
    async submitExam () {
      let BreakException = {}
      let cancelFlag = false
      // 计算分数，上传：
      let resultScore = 0 // 总分
      let resultExamList = []
      let questionLen = this.testInfo.examList.length // 题目数
      try {
        this.testInfo.examList.forEach(question => {
          if (!question.answerIndex) {
            this.$toast('所有选择不可为空！')
            throw BreakException
          } else {
            let questionScore = Number(question.options[question.answerIndex].score)
            resultExamList.push({
              questionTitle: question.questionTitle,
              answer: question.options[question.answerIndex].content,
              score: questionScore
            })
            resultScore += (questionScore / 10) * (100 / questionLen) // 每道题得分： 选择得分占比 * 该题分数总占比
          }
        })
      } catch (e) {
        if (e === BreakException) {
          cancelFlag = true
        }
      }
      if (cancelFlag) {
        return false
      }
      await api.test.submitTestResult({
        testId: this.testInfo._id,
        examList: resultExamList,
        userId: this.$app.globalData.userInfo.userId,
        resultScore: resultScore
      }).then(res => {
        if (res && res.data) {
          this.$toast('提交成功！')
          // 展示结果：
          this.showResult = true
          this.resultInfo = res.data
          this.resultInfo.resultScore = Number(this.resultInfo.resultScore)
        } else {
          this.$toast('提交失败！')
        }
      }).catch(err => {
        console.log(err)
        this.$toast('提交失败！')
      })
    }
  },
  onUnload () {
    // 解决页面返回后，数据没重置的问题
    // Object.assign(this.$data, this.$options.data())
  },
  onLoad (options) {
    this.testInfo = {
      id: ''
    }
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#63B8FF'
    })
    this.testId = options.id || ''
    debugger
    this.getTestInfo()
  },
  onShareAppMessage (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '心理测试题', // 分享内容
      path: '/pages/test/detail/main?id=' + this.testId, // 分享地址
      imageUrl: this.testInfo.picUrl // 分享图片
    }
  }
}
</script>
<style lang="less">
  .page-test-detail {
    height: 100%;
    .page-test-detail--description {
      border-radius: 8px;
      box-shadow: 0 0 10px #63B8FF;
      margin: 10px;
      padding: 10px;
      height: 100%;
      background: #fff;
      display: flex;
      flex-direction: column;
      text-align: center;
      align-items: center;
      justify-content: center;
      .test-num {
        padding: 10px;
      }
      .test-pic {
        margin-bottom: 15px;
        width: 100%;
        height: 200px;
      }
      .test-info {
        flex: 1;
        width: 100%;
        .test-info-item {
          text-align: left;
          .test-info-item-title {
            font-weight: bold;
          }
          .test-info-item-content {
            margin: 5px 0;
          }
        }
      }
      .test-btn {
        height: 40px;
        padding: 10px;
        font-size: 16px;
        border-radius: 8px;
        background: #63B8FF;
        border: 1px solid rgb(64, 112, 243);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
      }
    }
    .page-test-detail--examination {
      height: 100%;
      text-align: center;
      .page-test-detail--examination-container {
        display: flex;
        flex-direction:column;
        background: #fff;
        height: 100%;
        border-radius: 8px;
        box-shadow: 0 0 10px #63B8FF;
        margin: 20px;
        padding: 10px;
        .page-test-detail--examination-item-wrap {
          height: 100%;
          .page-test-detail--examination-item {
            height: 100%;
            display: flex;
            flex-direction: column;
            .page-test-detail--examination-item-title {
              margin-bottom: 20px;
              text-align: left;
            }
            .page-test-detail--examination-item-options {
              margin-right: 20px;
              flex: 1;
              .page-test-detail--examination-item-option {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                position: relative;
                margin-bottom: 15px;
                .radio {
                  margin-bottom:20rpx;
                  position: absolute;
                  top: -3.5rpx;
                  transform: scale(0.57);
                }
                .content {
                  text-align: left;
                  margin-left: 35px;
                }
              }
            }
            .page-test-detail--examination-item-btns {
              display: flex;
              flex-direction: row;
              justify-content: space-around;
              align-content: center;
              margin-top: 10px;
              .page-test-detail--examination-item-btn {
                height: 40px;
                width: 90px;
                padding: 5px 10px;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #63B8FF;
                border: 1px solid rgb(64, 112, 243);
              }
            }
          }
        }
      }
      .page-test-detail--examination-tip {
        height: 40px;
        width: 100%;
        font-size: 16px;
        font-weight: bolder;
      }
    }
    .page-test-detail--result {
      height: 100%;
      text-align: center;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px #63B8FF;
      margin: 20px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .page-test-detail--result-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-bottom: 15px;
      }
      .page-test-detail--result-score {
        .title {
          margin-bottom: 10px;
          font-weight: bold;
          font-size: 16px;
          color: #63B8FF;
        }
        .score {
          color: rgb(71, 167, 245);
          font-size: 24px;
          font-weight: bold;
        }
      }
      .page-test-detail--result-tip {
        color: #63B8FF;
        margin-top: 10px;
      }
    }
  }
</style>
