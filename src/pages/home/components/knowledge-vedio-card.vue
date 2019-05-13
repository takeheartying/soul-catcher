<template>
  <div class="knowledge-vedio-card" v-if="knowledge"  @click="gotoDetail(knowledge.id)">
    <vedio
    :src="knowledge.url"
    class="left-part" :controls="false"  play-btn-position="center">
      <span class="vedio-mask"></span>
      <cover-image class="vedio-cover-view" :src="knowledge.picUrl"></cover-image>
      <i class="iconfont icon-shipinbofang"></i>
    </vedio>
    <div class="middle-content">
      <p class="title">{{knowledge.title}}</p>
      <p class="desc">简介：{{knowledge.desc}}</p>
      <p class="author-info">发布者：{{knowledge.authorName}}【{{knowledge.authorAcademicTitle}}】</p>
      <p class="create-time">发布时间：{{knowledge.createTime}}</p>
      <p class="type">类型：{{knowledge.tagType}}</p>
    </div>
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
          url: `/pages/knowledge/vedio/detail?id=${id}`
        })
      }
    },
    errorVedio () {
      this.knowledge.url = ''
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
  .knowledge-vedio-card {
    padding: 12px 8px;
    height: 110px;
    display: flex;
    flex-direction: row;
    justify-items: center;
    background: #fff;
    .left-part {
      width: 80px;
      height: 80px;
      background: url("../../../img/common/vedio-bg.jpg") center center no-repeat;
      background-size: 100%;
      border-radius: 1px;
      margin-left: 5px;
      margin-right: 12px;
      position: relative;
      .vedio-mask {
        position: absolute;
        width: 80px;
        height: 80px;
        display: block;
        background: #666;
        opacity: 0.5;

      }
      .vedio-cover-view {
        width: 100%;
        height: 100%;
      }
      .icon-shipinbofang {
        position: absolute;
        font-size: 30px;
        color: rgba(253, 253, 253, 0.986);
        top: 50%;
        left: 50%;
        margin: -23px 0 0 -15px;
      }
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
      .desc,.author-info,.type,.create-time {
        .fn_ellipsis();
        font-size: 12px;
        margin-top: 5px;
        color: rgb(129, 116, 116)
      }
    }
  }
</style>
