<template>
  <svg :x="bond.start.x" :y="bond.start.y" class="bond">
    <line
      v-if="isSingleBond || !bond.bondOrder"
      x1="0"
      y1="0"
      :x2="dist"
      y2="0"
      :class="bond.bondOrder ? 'single' : 'partial'"
    ></line>
    <polygon v-else-if="bond.bondOrder == 1" :class="isApproachingBond ? 'solid' : 'patchy'"></polygon>
    <svg v-else-if="bond.bondOrder == 2">
      <line
        :y1="shortenRight ? 0 : 3.75"
        :y2="shortenRight ? 0 : 3.75"
        :x1="shortenLeft ? dist / 7 : 0"
        :x2="shortenLeft ? dist * 6 / 7 : dist"
      ></line>
      <line
        :y1="shortenLeft ? 0 : -3.75"
        :y2="shortenLeft ? 0 : -3.75"
        :x1="shortenRight ? dist / 7 : 0"
        :x2="shortenLeft ? dist * 6 / 7 : dist"
      ></line>
    </svg>
    <svg v-else-if="bond.bondOrder == 3">
      <line y1="5" y2="5" :x1="shortenLeft ? dist / 7 : 0" :x2="shortenLeft ? dist * 6 / 7 : dist"></line>
      <line y1="0" y2="0" x1="0" :x2="dist"></line>
      <line
        y1="-5"
        y2="-5"
        :x1="shortenRight ? dist / 7 : 0"
        :x2="shortenRight ? dist * 6 / 7 : dist"
      ></line>
    </svg>
  </svg>
</template>
<script lang="ts">
import Vue from "vue";
import { Bond, BondState } from "../../models";
export default Vue.extend({
  props: {
    bond: Bond
  },
  computed: {
    isSingleBond(): boolean {
      return this.bond.state == BondState.SINGLE_LINEAR;
    },
    isApproachingBond(): boolean {
      return this.bond.state == BondState.SINGLE_APPROACHING;
    },
    dist(): number {
      return Math.hypot(
        this.bond.start.x - this.bond.end.x,
        this.bond.start.y - this.bond.end.y
      );
    },
    angle(): number {
      return Math.atan2(
        this.bond.end.y - this.bond.start.y,
        this.bond.end.x - this.bond.start.x
      );
    },
    shortenLeft(): boolean {
      return (
        this.bond.state == BondState.DOUBLE_LEFT ||
        this.bond.state == BondState.TRIPLE_SHORT
      );
    },
    shortenRight(): boolean {
      return (
        this.bond.state == BondState.DOUBLE_RIGHT ||
        this.bond.state == BondState.TRIPLE_SHORT
      );
    }
  }
});
</script>