<template>
  <navigator class="test-info-card" v-if="testInfo" :url="url">
    <div class="middle-content">
      <p class="title">{{testInfo.title}}</p>
      <p class="desc">{{testInfo.desc}}</p>
      <p class="line3"><span class="type">{{testInfo.tagType}}</span> <span class="testnum">{{testInfo.testNum}}人已测</span></p>
    </div>
    <image :src="testInfo.picUrl" class="right-img"  mode="aspectFill"/>
  </navigator>
</template>
<script>
export default {
  props: {
    testInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    showType: { // 展示类型---   'result':测试结果列表  '': 测试列表
      type: String,
      default: ''
    },
    studentId: { // 学生id,用于查询该学生测试题的相应测试结果
      type: String,
      default: ''
    }
  },
  data () {
    return {
      url: '',
      userType: ''
    }
  },
  methods: {
    getUrl () {
      if (this.showType === 'result') {
        this.url = `/pages/test/result/main?id=${this.testInfo.id}&studentId=${this.studentId}` // 根据testId 和 userId 查询 对应的测试题结果 详情信息
      } else if (this.userType === '0') {
        let noEdit = (this.testInfo.testNum > 0) ? '1' : '0'
        // 测试已经被人测试过，则不可编辑测试题：
        this.url = `/pages/test/edit/main?id=${this.testInfo.id}&noEdit=${noEdit}` // 管理员根据testId 编辑测试题 【去编辑】
      } else {
        this.url = `/pages/test/detail/main?id=${this.testInfo.id}` // 根据testId 查询测试题 详情信息【去测试】
      }
    }
  },
  onLoad () {
    this.userType = this.$app.globalData.userType || ''
    this.getUrl()
  }
}
</script>

<style lang="less">
@import '~@/styles/functions.less';
@import '~@/styles/functions.less';
  .test-info-card {
    padding: 12px 0;
    border-bottom: 1px solid #eee;
    margin: 0px 20px;
    height: 55px;
    display: flex;
    flex-direction: row;
    justify-items: center;
    background: #fff;
    .right-img {
      width: 55px;
      height: 55px;
      border-radius: 1px;
      margin-left: 12px;
    }
    .middle-content {
      flex: 1;
      width: calc(100% - 120px);
      .title {
        font-size: 14px;
        .fn_ellipsis();
        font-weight: bolder;
        line-height: 18px;
      }
      .desc {
        .fn_ellipsis();
        font-size: 12px;
        color: rgb(129, 116, 116)
      }
      .line3 {
        font-size: 10px;
        margin-top: 5px;
        color: rgb(129, 116, 116);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .type {
        color: red;
      }
      // .testnum {

      // }
    }
  }
</style>
