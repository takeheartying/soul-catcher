<template>
  <div class="page-my-record--item" @click="goToDetail(recordInfo)">
  <navigator class="page-my-record--item-left-part" :url="'/pages/expert/detail/main?id=' + recordInfo.expertId">
    <image class="page-my-record--item-left-part-image" mode="aspectFill" :src="recordInfo.expertAvatar"></image>
  </navigator>
  <div class="page-my-record--item-middle-part">
    <p class="record-nickname">咨询师：{{recordInfo.expertName || recordInfo.expertNickName}}</p>
    <p class="record-score">平均分：<strong>{{recordInfo.averageScore}}分</strong></p>
    <p class="record-time">时间段：{{recordInfo.interval}}</p>
  </div>
  <div class="page-my-record--item-right-part">
    <button class="record-btn" @click.stop="goToDetail(recordInfo)">查看</button>
  </div>
</div>
</template>
<script>
export default {
  props: {
    recordInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    goToDetail (recordInfo) {
      wx.navigateTo({url: `/pages/my/record/detail/main?expertId=${recordInfo.expertId}&dateBegin=${recordInfo.dateBegin}`})
    }
  }
}
</script>
<style lang="less">
  .page-my-record--item {
    padding: 10px;
    border-bottom: 1px solid #eee;
    display: flex;
    flex-direction: row;
    .page-my-record--item-left-part {
      width: 55px;
      margin-right: 10px;
      .page-my-record--item-left-part-image {
        width: 55px;
        height: 55px;
        border-radius: 50%;
      }
    }
    .page-my-record--item-middle-part {
      flex: 1;
      .record-nickname {
        // font-weight: bolder;
      }
      .record-score {
        strong {
          display: inline;
          font-size: 14px;
          color: #FFD161;
        }
      }
      .record-time {
        // color: rgb(160, 157, 157);
      }
    }
    .page-my-record--item-right-part {
      margin-left: 10px;
      display:flex;
      align-items:center;
      justify-content:center;
      flex-direction:row;
      .record-btn {
        border-radius: 10px;
        border: 1px solid #FFD161;
        font-size: 14px;
        color: #FFD161;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        height: 30px;
      }
    }
  }
</style>
