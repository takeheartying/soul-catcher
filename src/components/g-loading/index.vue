<template>
  <div class="g-loading" v-show="loading">
    <div class="g-loading--wrapper">
      <div class="g-dot"></div>
      <div class="g-dot"></div>
      <div class="g-dot"></div>
      <div class="g-dot"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
