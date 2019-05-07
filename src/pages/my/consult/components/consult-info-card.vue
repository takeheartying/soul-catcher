<template>
  <navigator class="consult-info-card" v-if="consultInfo" :url="'/pages/consult/detail/main?id=' + consultInfo.id" >
    <image mode="aspectFit" :src="consultInfo.avatar" class="left-part"></image>
    <div class="right-part">
      <p class="line1">{{consultInfo.name}} <span>{{consultInfo.authorAcademicTitle}}</span></p>
      <p class="line2">状况评分：&nbsp;{{consultInfo.consultScore}}</p>
      <p class="line3">
        <span>咨询时间：&nbsp;{{consultInfo.consultTime}}</span>
      </p>
      <p class="line4" v-if="consultInfo.tagList">
        <span class="tag" v-for="(tag, index) in consultInfo.tagList" :key="index">{{tag}}</span>
      </p>
    </div>
  </navigator>
</template>
<script>
export default {
  props: {
    consultInfo: {
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
.consult-info-card {
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
      font-size:14px;
      span {
        display: inline-block;
        margin-right: 8px;
      }
    }
    .line4 {
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
  }
}
</style>
