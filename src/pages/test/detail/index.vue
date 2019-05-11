<template>
  <div class="page-test-detail">
    <!-- 心理测试详情页： -->
    <!-- 1.开始测试导引： -->
    <div class="page-test-detail--description" v-if="!hasStartTest && testInfo.id && !showResult">
      <div class="test-title">{{testInfo.title}}</div>
      <div class="test-num">{{testInfo.testNum}}人测过</div>
      <image class="test-pic" mode="aspectFill" :src="testInfo.picUrl"></image>
      <ul class="test-info">
        <li class="test-info-item">
          <div class="test-info-item-title">类型：</div>
          <div class="test-info-item-content">{{testInfo.typeDesc}}</div>
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
              <radio-group class="page-test-detail--examination-item-option" v-for="(option, optionIndex) in question.options" :key="optionIndex">
                <radio @click="clickRadio(question, index, option, optionIndex)" class="radio" color="#63B8FF" :name="question.id" :checked="option.isChecked"></radio>
                <p class="content">{{option.content}}</p>
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
      <image class="page-test-detail--result-avatar" mode="aspectFill" :src="resultInfo.avatar"></image>
      <div class="page-test-detail--result-score">
        <p class="title">你的心理状况</p>
        <p class="score">{{resultInfo.score}}分</p>
      </div>
      <div class="page-test-detail--result-tip" v-if="resultInfo.score < 4">当前心理状况不佳，建议向相关专家咨询哦~</div>
      <div class="page-test-detail--result-tip" v-if="resultInfo.score >= 4 && resultInfo.score < 8">当前心理状况良好，按需咨询哦~</div>
      <div class="page-test-detail--result-tip" v-if="resultInfo.score >= 8">当前心理状况不错，继续保持哦~</div>
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
        id: this.testId
      }).then(res => {
        this.testInfo = res
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.testInfo = {
        picUrl: 'http://img3.imgtn.bdimg.com/it/u=2870322368,453611869&fm=26&gp=0.jpg',
        title: '从积极心理学到幸福感',
        desc: '心境由心而设，态度可以决定我们的生活',
        detail: '围殴减肥的空间打发时间爱发科的结论是开饭啦司法解释口岸疯狂夺金萨福克精神科拉飞机拉萨九分裤大富科技按时付款了贷款酸辣粉东方健康路撒放开了的附件安联大厦积分卡斯加咖啡拉萨到付款荆防颗粒三加上端口分类考试了',
        type: 4, // 1爱情脱单 2智商情商 3趣味性格 4心理综合
        typeDesc: '心理综合',
        testNum: 111,
        id: '111',
        examList: [ // 测试题目列表
          {
            questionTitle: '你曾经想要成为小说家或者词作者吗？',
            questionId: '22333',
            options: [
              {
                content: '想过',
                score: 7, // 心理健康积分
                isChecked: false
              },
              {
                content: '从没想过',
                score: 8,
                isChecked: false
              }
            ]
          },
          {
            questionTitle: '学生时代，在文艺汇演时，你基本都是主角？',
            questionId: '33323',
            options: [
              {
                content: '是的',
                score: 7, // 心理健康积分
                isChecked: false
              },
              {
                content: '没有，我一般低调',
                score: 8,
                isChecked: false
              }
            ]
          },
          {
            questionTitle: '你一次都没有被异性追过？',
            questionId: '654756',
            options: [
              {
                content: '是的',
                score: 7, // 心理健康积分
                isChecked: false
              },
              {
                content: '当然不是',
                score: 8,
                isChecked: false
              }
            ]
          },
          {
            questionTitle: '舞会前，你会积极调查即将出席的异性情况？',
            questionId: '454354',
            options: [
              {
                content: '是的',
                score: 7, // 心理健康积分
                isChecked: false
              },
              {
                content: '不会的呀呀呀呀呀呀呀呀呀晕晕晕晕晕晕晕呀呀呀呀呀呀晕晕晕晕晕晕晕晕晕晕晕晕晕晕晕晕晕晕嘤嘤嘤嘤嘤嘤嘤',
                score: 8,
                isChecked: false
              }
            ]
          }
        ]
      }
    },
    startTest () { // 开始测试
      this.hasStartTest = true
    },
    clickRadio (question, questionIndex, option, optionIndex) { // 选择radio，进入下一题
      // 除了更改当前选择，其他全部置否：
      this.testInfo.examList[this.curIndex].options.forEach((option, index) => {
        if (index === optionIndex) {
          option.isChecked = true
        } else {
          option.isChecked = false
        }
      })
      if (this.curIndex + 1 < this.testInfo.examList.length) {
        this.curIndex++
      }
      // 下一题也已经全部置空
    },
    clickLastQuestion () { // 点击上一题
      // 这一题的选择清空：
      this.testInfo.examList[this.curIndex].options.forEach(option => {
        option.isChecked = false
      })
      // 上一题的选择清空：
      this.curIndex--
      this.testInfo.examList[this.curIndex].options.forEach(option => {
        option.isChecked = false
      })
    },
    async submitExam () {
      await api.test.submitTest({
        id: this.testInfo.id,
        examList: this.testInfo.examList
      }).then(res => {
        if (res) {
          this.$toast('提交成功！')
          // 展示结果：
          this.showResult = true
          this.resultInfo = res
        } else {
          this.$toast('提交失败！')
        }
      }).catch(err => {
        console.log(err)
        this.$toast('提交失败！')
      })
      // mock数据：
      this.showResult = true
      this.resultInfo = {
        score: 9.0,
        avatar: 'http://img0.imgtn.bdimg.com/it/u=1542008560,3630016374&fm=11&gp=0.jpg'
      }
    }
  },
  onLoad (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#63B8FF'
    })
    this.testId = options.id || ''
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
