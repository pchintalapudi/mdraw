<template>
  <g class="lone-pair" :transform="`translate(${dist+9}, -5) rotate(${angle}, ${-dist-4}, 0)`">
    <circle v-if="count === 1" cx="0" cy="0" r="2"></circle>
    <template v-else>
      <circle cx="0" cy="-3" r="2" fill="black"></circle>
      <circle cx="0" cy="3" r="2" fill="black"></circle>
    </template>
  </g>
</template>
<script lang="ts">
import Vue from "vue";
import { LonePair, RGroup } from "../../models";
export default Vue.extend({
  props: { lonepair: LonePair, dist: Number },
  computed: {
    count(): number {
      return this.lonepair.count;
    },
    angle(): number {
      return this.lonepair.angle;
    }
  }
});
</script>
