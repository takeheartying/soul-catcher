<template>
  <div class="knowledge-article-card" v-if="knowledge"  @click="gotoDetail(knowledge.id)">
    <image :src="knowledge.picUrl" class="left-img"  mode="aspectFill"/>
    <div class="middle-content">
      <p class="title">{{knowledge.title}}</p>
      <p class="desc">{{knowledge.desc}}</p>
      <p class="type">{{knowledge.tagType}}</p>
    </div>
    <div class="right-content"><button class="right-btn">查看</button></div>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    gotoDetail (id) {
      if (id) {
        wx.navigateTo({
          url: `/pages/knowledge/article/detail?id=${id}`
        })
      }
    }
  },
  props: {
    knowledge: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>

<style lang="less">
@import '~@/styles/functions.less';
  .knowledge-article-card {
    padding: 12px 8px;
    height: 55px;
    display: flex;
    flex-direction: row;
    justify-items: center;
    background: #fff;
    .left-img {
      width: 55px;
      height: 55px;
      border-radius: 1px;
      margin-left: 5px;
      margin-right: 12px;
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
      .type {
        font-size: 10px;
        margin-top: 5px;
        color: rgb(129, 116, 116)
      }
    }
    .right-content {
      position: relative;
      right: 10px;
      top: 20px;
      height: 55px;
      left:0px;
      margin-left:10px;
      width: 44px;
      line-height: 55px;
      text-align: right;
      .right-btn {
        width: 44px;
        height: 20px;
        line-height: 19px;
        font-size: 14px;
        text-align: center;
        color: rgb(197, 95, 165);
        border-radius: 14px;
        border: 1px solid;
        padding:0 3px;
        background: #fff;
      }
    }
  }
</style>
