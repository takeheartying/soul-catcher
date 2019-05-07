<template>
  <div class="page-knowledge-list">
    知识库列表
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
  .page-knowledge-list {
    background: #fff;
  }
</style>
