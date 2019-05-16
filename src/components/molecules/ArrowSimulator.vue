<template>
  <g :transform="`translate(${position.x}, ${position.y})`" style="pointer-events:none;">
    <polygon
      :points="stubby ? '0,5 0,-5 5,0' : '0,3.5, 0, -3.5, 10,0'"
      style="fill:black;stroke:transparent;pointer-events:none;"
    ></polygon>
  </g>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: { position: Object as () => { x: number; y: number }, stubby: Boolean }
});
</script>
<style scoped>
</style>
