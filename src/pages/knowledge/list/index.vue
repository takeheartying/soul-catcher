<template>
  <div class="page-knowledge-list">
    知识库列表
  </div>
</template>
<script>
export default {
  data () {
    return {
      userType: '',
      expertId: ''
    }
  },
  methods: {

  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.expertId = options.expertId || '' // 展示的是某专家知识库列表
  },
  mounted () {

  }
}
</script>

<style lang="less">
  .page-knowledge-list {
    background: #fff;
  }
</style>
