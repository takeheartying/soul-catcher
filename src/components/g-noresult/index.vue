<template>
  <div class="g-noresult" v-show="show">
      <img class="g-noresult--img" src="http://img4.imgtn.bdimg.com/it/u=2716432938,76393042&fm=15&gp=0.jpg">
      <div class="g-noresult--message">{{ message }}</div>
      <div class="g-noresult--tip" v-if="tip">{{ tip }}</div>
      <a class="g-noresult--btn" v-if="btn.content" :href="btn.url">{{btn.content}}</a>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: '没有找到相关结果'
    },
    tip: {
      type: String,
      default: ''
    },
    btn: {
      type: Object,
      default () {
        return {
          content: '',
          url: ''
        }
      }
    }
  }
}
</script>
<style lang="less">
  .g-noresult {
    text-align: center;
    margin: 0 auto;
    padding-top: 90px;
  }
  .g-noresult--img {
      width: 140px;
      height: 140px;
  }
  .g-noresult--message {
    margin: 10px 0 17px 0;
    font-size: 15px;
    color: #999;
  }
  .g-noresult--tip {
    font-size: 12px;
    margin-bottom: 10px;
  }
  .g-noresult--btn {
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(141, 205, 218);
    border-radius: 8px;
    border: 1px solid rgb(141, 205, 218);
    width: 80px;
    height: 30px;
    position: relative;
    left: 50%;
    margin-left: -40px;
  }
</style>
