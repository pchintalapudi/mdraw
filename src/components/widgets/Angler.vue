<template>
  <g class="angler">
    <path :d="path" class="path" :transform="`rotate(${offset} ${bond.start.x} ${bond.start.y})`"></path>
    <text :transform="`translate(${bumpX}, ${bumpY})`">{{`${beautified}°`}}</text>
  </g>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { Bond } from "@/models";
import { Constants } from "@/utils";
export default Vue.extend({
  props: {
    offset: Number as PropType<number>,
    angle: Number as PropType<number>,
    bond: Object as PropType<Bond>
  },
  computed: {
    path(): string {
      return `M ${this.bond.start.x} ${this.bond.start.y} l ${
        Constants.bondLength
      } 0 A ${Constants.bondLength} ${Constants.bondLength} 0 0 ${
        this.beautified > 0 ? 0 : 1
      } ${this.bond.start.x +
        Math.cos((this.angle * Math.PI) / 180) * Constants.bondLength} ${this
        .bond.start.y +
        Math.sin((this.angle * Math.PI) / 180) * Constants.bondLength}`;
    },
    beautified(): number {
      let a = this.angle as number;
      a -= 720;
      a %= 360;
      a *= -1;
      a = a > 180 ? a - 360 : a;
      a = Math.round(a * 1000) / 1000;
      return a;
    },
    bumpX(): number {
      return this.bond.start.x + Constants.bondLength;
    },
    bumpY(): number {
      return this.bond.start.y + Constants.bondLength;
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