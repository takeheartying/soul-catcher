<template>
  <div :class="'g-switch-buttons ' + className">
    <span :class="'g-switch-buttons--button' + computedClassStrs[index]" @click="$emit('input', index)" v-for="(item, index) in resolveList" :key="index">{{item.text}}</span>
  </div>
</template>

<script>
import enhanceList from '@/lib/enhanceList'
export default {
  props: {
    value: Number,
    className: String,
    list: Array
  },
  mixins: [enhanceList]
}
</script>

<style lang="less">
@import "./../../styles/variable.less";
.g-switch-buttons {
  &--button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    width: 64px;
    color: #999999;
    font-size: 12px;
    border: 1px solid #ddd;
    border-radius: 12px;
    &:not(:nth-of-type(1)) {
      margin-left: 8px;
    }
    &:active {
      background-color: darken(@color-main-white, 10%);
    }
    &.active {
      color: @color-main-blue;
      border-color: @color-main-blue;
    }
  }
}
</style>
