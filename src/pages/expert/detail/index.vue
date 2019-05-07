<template>
  <div class="page-expert-detail">
    专家主页详情
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
  .page-expert-detail {
    background: #fff;
  }
</style>
