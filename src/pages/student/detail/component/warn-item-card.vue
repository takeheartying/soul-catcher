<template>
  <div class="warn-item-card">
    <navigator class="warn-item-card--item" :url="'/pages/score/detail/main?id=' + warnInfo.id + '&scoreType=student'">
      <image class="warn-item-card--item-left-part" :src="warnInfo.avatar || defaultPic" mode="aspectFill"></image>
      <div class="warn-item-card--item-middle-part">
        <p class="warn-nickname">{{warnInfo.name || warnInfo.nickName}}</p>
        <p class="warn-goodat">擅长：{{warnInfo.goodAt}}</p>
        <p class="warn-time">{{warnInfo.createTime}}</p>
      </div>
      <div class="warn-item-card--item-right-part">
        <div class="consult-score-content" >{{warnInfo.score ? warnInfo.score + '分' : '暂无'}}</div>
      </div>
    </navigator>
  </div>
</template>
<script>
export default {
  props: {
    warnInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      defaultPic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1320258899,2257109664&fm=26&gp=0.jpg'
    }
  }
}
</script>

<style lang="less">
  @import "~@/styles/functions.less";
  .warn-item-card {
    .warn-item-card--item {
      background: #fff;
      border-bottom: 0.5px solid #eee;
      padding: 10px;
      display: flex;
      flex-direction: row;
      .warn-item-card--item-left-part {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .warn-item-card--item-middle-part {
        flex: 1;
        .warn-nickname {
          font-weight: bolder;
          max-width: 250px;
          .fn_ellipsis();
        }
        .warn-goodAt {
          margin: 0 0 0 0;
        }
        .warn-time {
          font-size: 12px;
          .fn_ellipsis();
          color: rgb(160, 157, 157);
        }
      }
      .warn-item-card--item-right-part {
        margin-left: 10px;
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction:row;
        .consult-score-content {
          color: #FFD161;
          font-size: 16px;
          font-weight: bolder;
        }
      }
    }
  }
</style>
