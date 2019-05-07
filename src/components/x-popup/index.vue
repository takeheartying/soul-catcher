<template>
  <div class="x-popup" :style="{'display': (value || lazyShow) ? 'block' : 'none'}" :class="className + ' x-popup--' + direction + (lazyShow ? ' x-popup--show' : '')" @click="$emit('click')">
    <div class="x-popup--mask" :style="{'transition-duration': transitionDuration + 'ms'}" :class="show ? ' x-popup--active' : ''" v-show="hasMask" @click="maskClick"/>
    <div class="x-popup--container" :class="show ? ' x-popup--active' : ''" @transitionend="transitionEnd">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
    hasMask: {
      type: Boolean,
      default: true
    },
    className: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      validator: t => ['left', 'right', 'top', 'bottom', 'center'].includes(t),
      defalut: 'center'
    },
    clickMaskClose: {
      type: Boolean,
      default: true
    },
    transitionDuration: {
      type: Number,
      default: 250
    }
  },
  data () {
    return {
      lazyShow: false,
      show: false
    }
  },
  watch: {
    value (n) {
      setTimeout(() => {
        this.show = n
        this.lazyShow = true
        if (!n && this.direction === 'center') { // center模式关闭动画
          this.lazyShow = false
        }
      }, 50)
    }
  },
  methods: {
    transitionEnd () {
      if (!this.value) {
        this.lazyShow = false
      }
    },
    maskClick () {
      if (this.clickMaskClose) {
        this.$emit('input', false)
      }
      this.$emit('maskClick')
    }
  }
}
</script>
<style lang="less">
@import "~@/styles/variables.less";
@prefix: x-popup;
.@{prefix} {
  &--center &--container {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    &.@{prefix}--active {
      transform: translate(-50%, -50%) scale(1);
    }
  }
  &--bottom &--container {
    bottom: 0;
    left: 0;
    width: 100%;
    transform: translate3d(0, 100%, 0);
  }
  &--top &--container {
    top: 0;
    left: 0;
    width: 100%;
    transform: translate3d(0, -100%, 0);
  }
  &--left &--container {
    top: 0;
    left: 0;
    height: 100%;
    transform: translate3d(-100%, 0, 0);
  }
  &--right &--container {
    top: 0;
    right: 0;
    height: 100%;
    transform: translate3d(100%, 0, 0);
  }
  &--container.@{prefix}--active {
    transform: translate3d(0, 0, 0);
  }
  &--container {
    position: fixed;
    transition: all 0.1s ease-in-out;
    z-index: 101;
    opacity: 0;
  }
  &--show &--container {
    opacity: 1;
    visibility: visible;
  }
  &--mask {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    z-index: 100;
    opacity: 0;
    background: rgba(0, 0, 0, .5);
    transition: all 0.1s ease;
    &.@{prefix}--active {
      opacity: 1;
    }
  }
}
</style>
