<template>
  <g class="angler">
    <path :d="path" class="path"></path>
  </g>
</template>
<script lang="ts">
import Vue from "vue";
import { Bond } from "@/models";
import { Constants } from "@/utils";
export default Vue.extend({
  props: {
    offset: Number,
    angle: Number,
    bond: Bond
  },
  computed: {
    path(): string {
      return `M ${this.bond.start.x} ${this.bond.start.y} L ${
        this.bond.end.x
      } ${this.bond.end.y} A ${Constants.bondLength} ${
        Constants.bondLength
      } 0 0 ${Math.sin(this.angle) < 0 ? 1 : 0} ${this.bond.end.x} ${
        this.bond.end.y
      }`;
    }
  }
});
</script>
<style>
.path {
  fill: transparent;
  stroke: black;
  stroke-dasharray: 5, 5;
}
.angler {
  pointer-events: none;
}
</style>