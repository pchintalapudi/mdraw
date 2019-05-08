<template>
  <rect
    :x="left"
    :y="top"
    :width="right - left"
    :height="bottom - top"
    fill="#0088ff44"
    stroke="#0088ff88"
    stroke-width="1.5"
  ></rect>
</template>
<script lang="ts">
import Vue from "vue";
import { SelectionRectangle } from "../../models";
export default Vue.extend({
  props: { selectionRectangle: SelectionRectangle },
  computed: {
    left(): number {
      return this.selectionRectangle.left;
    },
    right(): number {
      return this.selectionRectangle.right;
    },
    top(): number {
      return this.selectionRectangle.top;
    },
    bottom(): number {
      return this.selectionRectangle.bottom;
    }
  }
});
</script>
