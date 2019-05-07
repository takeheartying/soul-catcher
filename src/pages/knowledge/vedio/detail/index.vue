<template>
  <div class="page-knowledge-vedio-detail">
    视频知识库详情
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
  .page-knowledge-vedio-detail {
    background: #fff;
  }
</style>
