<template>
	<div class="g-tabbar" :class="className">
		<div class="g-tabbar--item" :class="{'active': value === index}" v-for="(text, index) in list" :key="index" @click="$emit('changeTab', index)">
			<span class="g-tabbar--padding"></span><span class="g-tabbar--text">{{text}}</span><span class="g-tabbar--padding"></span>
		</div>
	</div>
</template>

<script>
export default {
  name: 'g-tabbar',
  props: {
    list: Array,
    value: Number,
    className: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less">
@import "./../../styles/variable";
@import "./../../styles/function";
.g-tabbar {
  display: flex;
  background-color: @color-main-white;
  &--item {
    height: 40px;
    flex: 1;
    text-align: center;
    font-size: 14px;
    position: relative;
    display: flex;
    align-items: stretch;
    justify-content: center;
    &.active .g-tabbar--text {
      color: #4489FF;
      border-bottom: 2px solid #4489FF;
    }
  }
  &--text {
    color: #28354c;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 3;
  }
  &--padding {
    flex: 1;
  }
}
</style>
