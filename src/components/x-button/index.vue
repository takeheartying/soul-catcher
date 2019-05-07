<template>
  <button v-show="show" :open-type="openType" :class="'x-button ' + className + (disabled ? ' disabled' : '')" @click="click">
    <slot>
      {{text}}
    </slot>
  </button>
</template>

<script>
export default {
  props: {
    text: String,
    className: {
      type: String,
      default: ''
    },
    disabled: Boolean,
    openType: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>
<style lang="less">
@import "~@/styles/variables.less";
@import "~@/styles/functions.less";
.x-button {
  .btn-reset;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 20px;
  color: @color-main-white;
  background-color: @color-main-blue;
  &:active {
    background-color: darken(@color-main-blue, 10%);
  }
  &.disabled {
    background-color: #ccc;
    &:active {
      background-color: darken(#ccc, 10%);
    }
  }
}
</style>
