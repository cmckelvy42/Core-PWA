<template>
  <div class="loading-bar">
    <div class="bar" :style="`height: ${height}px`" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    height: {
      type: Number,
      default: 6,
    },
  },
})
</script>
<style scoped lang="less">
.loading-bar {
  &:extend(.full-width);
  .bar {
    animation: loading 2s cubic-bezier(0.17, 0.37, 0.43, 0.67) infinite;
    float: left;
    width: 5px;
    height: 6px;
    border-radius: 2px;
  }
  display: inline-flex;
}
</style>
