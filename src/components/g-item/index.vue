<template>
  <div class="g-item" :class="hasRight ? 'has-right' : ''" @click="$emit('click')">
    <span class="g-item--left">{{leftText}}</span>
    <div class="g-item--center" :class="className">
      <slot>{{centerText}}</slot>
    </div>
    <span class="g-item--right" v-if="hasRight"></span>
  </div>
</template>

<script>
export default {
  name: 'g-item',
  props: {
    leftText: {
      type: String,
      default: ''
    },
    centerText: {
      type: String,
      default: ''
    },
    hasRight: Boolean,
    className: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less">
@import "~@/styles/variables.less";
@import "~@/styles/functions.less";
.g-item {
  color: red;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  font-size: 14px;
  height: 50px;
  background-color: @color-main-white;
  &:nth-of-type(1) {
    .borders-h;
  }
  &:not(:nth-of-type(1)) {
    .border(B);
  }
  &.has-right:active {
    background-color: darken(@color-main-white, 10%);
  }
  &--left {
    color: #666666;
    margin-right: 6px;
  }
  &--center {
    flex: 1;
    text-align: right;
    color: #999;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  &--right {
    box-sizing: border-box;
    width: 8px;
    height: 8px;
    border-right: 2px solid #c7c7cc;
    border-bottom: 2px solid #c7c7cc;
    transform: rotate(-45deg);
    margin-left: 6px;
  }
}
</style>
