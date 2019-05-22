<template>
  <!-- 我的测试是查测试结果列表： -->
  <navigator class="test-info-card" v-if="testInfo && testResultId" :url="'/pages/test/result/main?id=' + testResultId" >
    <div class="middle-content">
      <p class="title">{{testInfo.title}}</p>
      <p class="desc">{{testInfo.desc}}</p>
      <p class="line3"><span class="type">{{testInfo.tagTypeDesc}}</span> <span class="testnum">{{testInfo.testorNum}}人已测</span></p>
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
    testResultId: {
      type: String,
      required: true
    }
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
