<template>
  <div class="page-consult x-column-select">
    <scroll-view scroll-y class="x-column-select--province" @scroll="scroll">
      <div class="x-column-select--item" :class="{'x-column-select--active': leftSelectIndex === index}" v-for="(item, index) in leftList" :key="index" @click="$emit('leftSelect', index)">
        <span class="x-column-select--text">{{item.text}}</span>
      </div>
      <div class="x-column-select--item x-column-select--active" :class="'x-column-select--fixed x-column-select--' + direction">
        <span class="x-column-select--text"  v-if="leftList.length">{{leftList[leftSelectIndex].text}}</span>
      </div>
    </scroll-view>
    <scroll-view scroll-y class="x-column-select--city">
      <div class="x-column-select--item" :class="{'x-column-select--active': rightSelectIndex === index}" v-for="(item, index) in rightList" :key="index" @click="$emit('rightSelect', index)">
        <span class="x-column-select--icon"></span>
        <span class="x-column-select--text">{{item.text}}</span>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  props: {
    leftList: Array,
    leftSelectIndex: Number,
    rightList: Array,
    rightSelectIndex: Number,
  },
  data () {
    return {
      direction: 'none'
    }
  },
  mounted () {
    let query = wx.createSelectorQuery()
    query.select('.x-column-select--province').boundingClientRect()
    query.exec(arr => {
      this.viewHeight = arr[0].height
    })
    let query2 = wx.createSelectorQuery()
    query2.select('.x-column-select--fixed').boundingClientRect()
    query2.exec(arr => {
      this.itemHeight = arr[0].height
    })
  },
  watch: {
    leftSelectIndex () {
      this.setDirection()
    },
    rightList () {
      this.scrollTop = 0
      this.direction = 'none'
    }
  },
  methods: {
    scroll (e) {
      if (!this.itemHeight || !this.viewHeight) return
      this.scrollTop = e.target.scrollTop
      this.setDirection()
    },
    setDirection () {
      if (this.scrollTop > this.leftSelectIndex * this.itemHeight) {
        this.direction = 'top'
      } else if ((this.leftSelectIndex + 1) * this.itemHeight - this.scrollTop > this.viewHeight) {
        this.direction = 'bottom'
      } else {
        this.direction = 'none'
      }
    }
  }
}
</script>

<style lang="less">
@import "../../styles/variable";
@import "../../styles/function";
@prefix: x-column-select;
.@{prefix} {
  display: flex;
  flex-direction: row;
  &--province {
    flex: 4;
    .x-column-select--item {
      .border;
    }
  }
  &--city {
    flex: 5;
    background-color: @color-main-white;
  }
  &--item {
    height: 50px;
    box-sizing: border-box;
    font-size: 14px;
    padding-left: 24px;
    display: flex;
    align-items: center;
    position: relative;
    &.x-column-select--active {
      background-color: @color-main-white;
    }
  }
  &--active &--text::before {
    display: inline-block;
    content: "";
    width: 0;
    height: 0;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 4px solid #3f86ff;
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
  }
  &--fixed {
    position: fixed;
    left: 0;
    width: 44.45%;
    background-color: #3f86ff;
    color:@color-main-white;
  }
  &--fixed.@{prefix}--item.@{prefix}--active {
    background-color: #3f86ff;
    .@{prefix}--text::before {
      border-left-color: @color-main-white;
    }
  }
  
  &--none {
    visibility: hidden;
  }
  &--top {
    top: 0;
  }
  &--bottom {
    bottom: 0;
  }
}
</style>
