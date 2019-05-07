<template>
  <navigator class="expert-info-card" v-if="expertInfo" :url="'/pages/follow/detail/main?id=' + expertInfo.id" >
    <image mode="aspectFit" :src="expertInfo.avatar" class="left-part"></image>
    <div class="right-part">
      <p class="line1">{{expertInfo.name}} <span>{{expertInfo.authorAcademicTitle}}</span></p>
      <p class="line2">{{expertInfo.workUnit}}</p>
      <p class="line3" v-if="expertInfo.tagList">
        <span class="tag" v-for="(tag, index) in expertInfo.tagList" :key="index">{{tag}}</span>
      </p>
      <p class="line4">
        <span>咨询数&nbsp;{{expertInfo.consultNum}}</span>
        <span>关注者&nbsp;{{expertInfo.fanNum}}</span>
      </p>
    </div>
  </navigator>
</template>
<script>
export default {
  props: {
    expertInfo: {
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
.expert-info-card {
  padding: 12px 15px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: row;
  .left-part {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
  }
  .right-part {
    .line1 {
      font-size: 16px;
      font-weight: bolder;
      span {
        display: inline-block;
        margin-left: 5px;
        font-size: 12px;
        color: rgb(187, 186, 186);
      }
    }
    .line2 {
      font-size: 14px;
      .fn_ellipsis();
      margin-top: 3px;
    }
    .line3 {
      margin: 5px 0;
      font-size: 12px;
      color:  rgb(187, 186, 186);
      span {
        display: inline-block;
        padding: 0 4px;
        margin-right: 8px;
        border: 1px solid #eee;
        border-radius: 3px;
      }
    }
    .line4 {
      font-size:10px;
      span {
        display: inline-block;
        margin-right: 8px;
        color: rgb(145, 139, 139);
      }
    }
  }
}
</style>
