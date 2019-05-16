<template>
  <g :transform="`translate(${x}, ${y}) rotate(${angle})`">
    <line x1="0" y1="0" :x2="dist" :y2="0" style="fill:transparent;stroke:black;"></line>
    <polygon :points="`${dist},3.5, ${dist}, -3.5, ${dist + 10},0`"></polygon>
  </g>
</template>
<script lang="ts">
import Vue from "vue";
import { StraightArrow } from "@/models";
export default Vue.extend({
  props: { arrow: StraightArrow },
  computed: {
    dist(): number {
      return this.arrow.dist;
    },
    x(): number {
      return this.arrow.start.x;
    },
    y(): number {
      return this.arrow.start.y;
    },
    angle(): number {
      return this.arrow.angle;
    }
  }
});
</script>
