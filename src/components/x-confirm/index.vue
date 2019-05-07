<template>
  <x-popup v-model="currentValue" direction="center" @maskClick="$emit('cancel')">
    <div class="x-confirm">
      <div class="x-confirm--title">
        <slot name="title">
          {{title}}
        </slot>
      </div>
      <div class="x-confirm--content">
        <slot name="content">
          {{content}}
        </slot>
      </div>
      <div class="x-confirm--btns">
        <button class="x-confirm--btn" @click="select('cancel')">{{cancelText}}</button>
        <button class="x-confirm--btn" :open-type="openType" @getphonenumber="getphonenumber" @click="select('ok')">{{okText}}</button>
      </div>
    </div>
  </x-popup>
</template>

<script>
import XPopup from '@/components/x-popup/index.vue'
export default {
  name: 'x-confirm',
  components: {
    XPopup
  },
  props: {
    value: Boolean,
    title: {
      type: String,
      default: '提示'
    },
    content: {
      type: String,
      default: ''
    },
    openType: {
      type: String,
      default: ''
    },
    isGetWxMobile: Boolean,
    cancelText: {
      type: String,
      default: '取消'
    },
    okText: {
      type: String,
      default: '确定'
    }
  },
  data () {
    return {
      currentValue: this.value
    }
  },
  watch: {
    value (n) {
      this.currentValue = n
    },
    currentValue (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    select (type) {
      this.currentValue = false
      this.$emit(type)
    },
    getphonenumber (e) {
      this.$emit('getphonenumber', e)
    }
  }
}
</script>

<style lang="less">
@import "~@/styles/variables.less";
@import "~@/styles/functions.less";
.x-confirm {
  border-radius: 10px;
  overflow: hidden;
  background-color: @color-main-white;
  width: 330px;
  box-sizing: border-box;
  &--title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    font-size: 16px;
    color: #28354c;
  }
  &--content {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #999;
    padding: 0 20px 12px 20px;
    text-align: center;
  }
  &--btns {
    display: flex;
    align-items: center;
    height: 40px;
    padding-top: 1px;
    .border(T);
  }
  &--btn {
    .btn-reset;
    box-sizing: border-box;
    height: 40px;
    font-size: 16px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: @color-main-blue;
    background-color: @color-main-white;
    &:active {
      background-color: darken(@color-main-white, 10%);
    }
    &:not(:nth-of-type(1)) {
      .border(L);
    }
  }
}
</style>
