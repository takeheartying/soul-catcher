<template>
  <div class="page-knowledge-article-detail">
    文章知识库详情
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
  .page-knowledge-article-detail {
    background: #fff;
  }
</style>
