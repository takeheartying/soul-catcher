<template>
  <div class="x-action-sheet" :class="{'x-action-sheet--show': show }">
    <div class="x-action-sheet--mask" @click="maskClick" />
    <div class="x-action-sheet--container">
      <span class="x-action-sheet--title" v-if="title">{{title}}</span>
      <div class="x-action-sheet--border-h">
        <scroll-view scroll-y class="x-action-sheet--scroll">
          <button
            v-for="(item, index) in resolveList"
            :key="index + '-' + item.text"
            @click="selectClick(index)"
            :open-type="item.openType"
            :class="'x-action-sheet--item ' + computedClassStrs[index]">
            {{item.text}}
          </button>
        </scroll-view>
      </div>
      <button class="x-action-sheet--extra" @click="$emit('extraClick')" :class="extraClass" v-show="extraText">{{extraText}}</button>
      <div v-if="cancelText" class="x-action-sheet--footer">
        <button class="x-action-sheet--item" @click="cancelClick">{{ cancelText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import enhanceList from '@/lib/enhanceList'
export default {
  props: {
    show: Boolean,
    title: String,
    cancelText: String,
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    extraClass: String,
    extraText: String
  },
  mixins: [enhanceList],
  methods: {
    maskClick () {
      if (!this.closeOnClickOverlay) {
        return
      }
      this.resolveCancelClick()
    },
    cancelClick () {
      this.resolveCancelClick()
    },
    selectClick (index) {
      this.$emit('select', index)
    },
    resolveCancelClick () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="less">
@import "~@/styles/variables.less";
@import "~@/styles/functions.less";
.x-action-sheet {
  &--mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: rgba(0, 0, 0, .5);
    display: none;
  }
  &--container {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f8f8f8;
    transform: translate3d(0, 50%, 0);
    transform-origin: center;
    transition: all .2s ease;
    z-index: 11;
    opacity: 0;
    visibility: hidden;
  }
  &--scroll {
    max-height: 220px;
  }
  &--footer {
    margin-top: 6px;
  }
  &--show &--container {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    visibility: visible;
  }
  &--show &--mask {
    display: block;
  }
  &--title, &--item, &--extra {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: @color-main-white;
  }
  &--title {
    height: 32px;
    color: #a6a8b6;
    font-size: 12px;
  }
  &--item, &--extra {
    height: 50px;
    color: #333333;
    font-size: 14px;
    border: none;
    border-radius: 0;
    padding: 0;
    &:active {
      background-color: darken(@color-main-white, 10%);
    }
    &::before {
      content: '';
      border-width: 0;
      display: none;
    }
    &::after {
      content: '';
      border-width: 0;
      display: none;
    }
  }
  &--item {
    &:not(:nth-last-of-type(1)) {
      .border(B);
    }
  }
  &--extra {
    .border(B);
  }
  &--border-h {
    padding: 1px 0;
    .borders-h;
  }
}
</style>
