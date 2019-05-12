<template>
  <section class="page-score-edit">
    <!-- 专家评分预警编辑页 + 学生咨询评分编辑页 -->
    <form @submit="formSubmit" class="page-score-edit--form">
      <div class="zan-panel">
        <zan-field v-bind="Object.assign({}, handleFunctions, base.score)" :focus="curComponentId === base.score.componentId" :value="typeof scoreInfo.score === 'number' ? scoreInfo.score + '分' : scoreInfo.score"/>
        <zan-field v-if="userType === '2'" type="textarea" :height="150"  :focus="curComponentId === base.reason.componentId" v-bind="Object.assign({}, handleFunctions, base.reason)" :value="scoreInfo.reason"/>
        <div>
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
import api from '@/api'

export default {
  components: {
    ZanField
  },
  data () {
    return {
      curComponentId: '',
      userType: '',
      id: '',
      scoreInfo: {},
      handleFunctions: {
        handleZanFieldChange: this.handleZanFieldChange,
        handleZanFieldFocus: this.handleZanFieldFocus,
        handleZanFieldBlur: this.handleZanFieldBlur
      },
      base: {
        score: {
          focus: false,
          title: '我的评分：',
          placeholder: '请输入0-10的评分，<=4为预警',
          componentId: 'score'
        },
        reason: {
          focus: false,
          title: '状况阐述：',
          placeholder: '请输入学生目前心理状况',
          componentId: 'reason'
        }
      }
    }
  },
  methods: {
    async getScoreInfo () {
      // 获取评分信息：
      await api.score.getConsultScoreInfo({
        userId: this.id, // 被评分者id
        consultId: this.consultId // 咨询室id
      }).then(res => {
        this.scoreInfo = res || []
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.scoreInfo = {
        score: 3.0,
        reason: '艰苦奋斗举案说法据了解撒风口浪尖斯科拉飞机考虑是否进度款类似飞机阿卡丽房价快速拉加福禄寿的开始放假的老师姐夫'
      }
    },
    async formSubmit (e) {
      if (e && e.target && e.target.value) {
        let score = e.target.value.score.replace('分', '')
        if (!score) {
          this.$toast('请输入评分！')
          return false
        }
        if (isNaN(Number(score))) {
          this.$toast('请输入正确格式的评分！')
          return false
        }
        if (Number(score) > 10) {
          this.$toast('评分范围在0-10之间！')
          return false
        }
        if (!e.target.value.reason && this.userType === '2') {
          this.$toast('请输入学生状况阐述！')
          return false
        }
      } else {
        this.$toast('请输入评价！')
        return false
      }
      await api.score.submitScore({
        score: Number(e.target.value.score.replace('分', '')).toFixed(1),
        reason: e.target.value.reason,
        id: this.id || ''
      }).then(res => {
        this.$toast('评价成功！')
      }).catch(err => {
        console.log(err)
        this.$toast('系统出错！')
      })
    },
    handleZanFieldChange (e) {
      // const { componentId, target } = e
      // this.scoreInfo[componentId] = target.value
    },
    handleZanFieldFocus (e) {
      this.curComponentId = e.componentId
    },
    handleZanFieldBlur (e) {
      const { componentId, target } = e
      if (componentId === 'score') {
        let score = target.value.replace('分', '')
        if (isNaN(Number(score))) {
          this.$toast('请输入正确格式的评分！')
          return false
        }
        if (Number(score) < 0 || Number(score) >= 10) {
          this.$toast('评分范围在0-10之间！')
          return false
        }
        if (Number(score) === 0) {
          this.$toast('请输入评分！')
          return false
        }
        this.scoreInfo.score = Number(score).toFixed(1) + '分'
      }
      // 清除当前focus的输入框：
      this.curComponentId = ''
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.id = options.id // 被评分者id
    this.consultId = options.consultId
  },
  mounted () {
    let title = this.userType === '1' ? '学生心理状况评分' : '专家咨询评分'
    wx.setNavigationBarTitle({
      title
    })
    this.getScoreInfo()
  }
}
</script>
<style lang="less">
  .page-score-edit {
    background: #fff;
    height: 100%;
    .submit-btn {
      background: #63B8FF;
    }
  }
</style>
