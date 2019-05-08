<template>
  <div class="page-score-detail">
    专家评分预警详情页 + 学生咨询评分详情
  </div>
</template>
<script>
export default {
  data () {
    return {
      userType: ''
    }
  },
  methods: {

  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
  },
  mounted () {

  }
}
</script>

<style lang="less">
  .page-score-detail {
    background: #fff;
  }
</style>
