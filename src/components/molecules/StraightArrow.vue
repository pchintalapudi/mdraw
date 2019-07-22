<template>
  <g :transform="`translate(${x}, ${y}) rotate(${angle})`">
    <rect
      x="0"
      :y="d3 ? -5 : -0.5"
      :width="dist"
      :height="d3 ? 10 : 1"
      :style="`fill:${d3 ? 'url(#d3bond)' : 'transparent'};stroke:${d3 ? 'transparent' : selected ? 'blue' : 'black'};`"
    ></rect>
    <polygon
      :points="`${dist},${d3 ? 10.5 : 3.5}, ${dist}, ${d3 ? -10.5 : -3.5}, ${dist + (d3 ? 20 : 10)},0`"
      stroke="transparent"
      :style="`fill:${d3 ? 'url(#d3bond)' : selected ? 'blue' : 'black'};`"
    ></polygon>
  </g>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { StraightArrow } from "@/models";
export default Vue.extend({
  props: {
    arrow: Object as PropType<StraightArrow>,
    selected: Boolean,
    d3: Boolean
  },
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
