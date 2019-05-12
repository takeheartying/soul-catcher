<template>
  <section class="page-test-result-detail">
    <!-- 测试结果页： -->
    <div class="page-test-result-detail--container">
      <div class="page-test-result-detail--tips">
        <p>总分：{{testInfo.testScore}}分</p>
        <p>{{testInfo.createTime}}</p>
      </div>
      <ul class="page-test-result-detail--questions">
        <li class="page-test-result-detail--question" v-for="(question, index) in testInfo.examList" :key="index">
          <p class="page-test-result-detail--question-title">{{index + 1}}、{{question.questionTitle}}</p>
          <p class="page-test-result-detail--question-answer">
            <span class="answer-label">答：</span>
            <span class="answer-content">{{question.answer}}</span>
          </p>
        </li>
      </ul>
    </div>
    <g-loading :loading="loading"></g-loading>
    <g-noresult v-if="!testInfo.id" :show="!loading"
    :message="'抱歉，未能查询到测试结果~'">
    </g-noresult>
  </section>
</template>
<script>
import api from '@/api'
import GNoresult from '@/components/g-noresult/index.vue'
import GLoading from '@/components/g-loading/index.vue'

export default {
  data () {
    return {
      loading: false,
      testInfo: [],
      userType: '1' // 0 管理员 1 学生 2 专家 3 家长
    }
  },
  components: {
    GNoresult,
    GLoading
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.testId = options.id || ''
    this.studentId = options.studentId || '' // 没有学生id,则默认登录用户是学生，正在查询自己的测试结果页
  },
  methods: {
    async getTestInfo () {
      // 获取测试列表：
      this.loading = true
      await api.test.getTestResultListById({
        studentId: this.studentId || '',
        testId: this.id || ''
      }).then(res => {
        this.testInfo = res || {}
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.testInfo = {
        picUrl: 'http://img3.imgtn.bdimg.com/it/u=2870322368,453611869&fm=26&gp=0.jpg',
        title: '从积极心理学到幸福感',
        desc: '心境由心而设，态度可以决定我们的生活',
        type: '心理综合',
        testNum: 111,
        id: '111',
        testScore: 8.0,
        createTime: '2019-03-01 10:20',
        userId: '322323',
        examList: [ // 测试题目列表
          {
            questionTitle: '你曾经想要成为小说家或者词作者吗？',
            questionId: '22333',
            answer: '想过'
          },
          {
            questionTitle: '学生时代，在文艺汇演时，你基本都是主角？',
            questionId: '33323',
            answer: '是好的方法进口环节上发了附件啊开放后撒即可发动机开始复合接口是否合适的机会房价快速开发环境开发等复活卡时间段付款还是点击看法哈借款方的'
          },
          {
            questionTitle: '你一次都没有被异性追过？',
            questionId: '654756',
            answer: '是的'
          },
          {
            questionTitle: '舞会前，你会积极调查即将出席的异性情况？',
            questionId: '454354',
            answer: '没有的事'
          }
        ]
      }

      this.loading = false
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '测试结果'
    })
    this.getTestInfo()
  }
}
</script>

<style lang="less">
@import '~@/styles/functions.less';
.page-test-result-detail {
  height:100%;
  .page-test-result-detail--container {
    .page-test-result-detail--tips {
      background: #fff;
      height: 60px;
      display: flex;
      font-size: 14px;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      padding: 5px 0;
      p {
        color: rgb(122, 121, 121);
        font-weight: bold;
      }
    }
    .page-test-result-detail--questions {
      font-size: 14px;
      text-align: left;
      background: #fff;
      .page-test-result-detail--question {
        padding: 10px;
        border-top: 0.5px solid #eee;
        .page-test-result-detail--question-title {

        }
        .page-test-result-detail--question-answer {
          color: rgb(122, 121, 121);
          display:flex;
          .answer-label {
            display: inline-block;
          }
          .answer-content {
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>
