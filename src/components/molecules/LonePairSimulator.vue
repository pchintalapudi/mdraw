<template>
  <g :transform="`translate(${position.x}, ${position.y})`" style="pointer-events:none">
    <circle v-if="count === 1" cx="0" cy="0" r="2.5"></circle>
    <template v-else>
      <circle cx="-3" cy="-3" r="2.5"></circle>
      <circle cx="3" cy="3" r="2.5"></circle>
    </template>
  </g>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: { position: Object as () => { x: number; y: number }, count: Number }
});
</script>
