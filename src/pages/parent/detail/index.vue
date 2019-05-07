<template>
  <div class="page-parent-detail">
    家长主页详情
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
  .page-parent-detail {
    background: #fff;
  }
</style>
