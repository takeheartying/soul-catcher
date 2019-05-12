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
      isShowMy: false
    }
  },
  methods: {

  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.isShowMy = (options.isShowMy === '1' && this.userType === '2') // 是否展示的是某专家知识库列表
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
