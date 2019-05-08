<template>
  <g :transform="`translate(${bond.start.x} ${bond.start.y}) rotate(${angle})`" :class="classes">
    <line class="clickme" x1="0" y1="0" :x2="dist" y2="0"/>
    <line
      v-if="isSingleBond || !bond.bondOrder || isThicc"
      x1="0"
      y1="0"
      :x2="dist"
      y2="0"
      :class="`${(bond.bondOrder ? isThicc ? 'thonk' : 'single' : 'partial')} bond`"
    />
    <polygon
      v-else-if="bond.bondOrder == 1"
      :style="`fill: ${isApproachingBond ? 'black' : 'url(#patchy)'};stroke:transparent`"
      :points="`0,0 ${this.dist - 10},5 ${this.dist - 10},-5`"
    ></polygon>
    <g v-else-if="bond.bondOrder == 2">
      <line
        :y1="shortenRight ? 0 : 3.75"
        :y2="shortenRight ? 0 : 3.75"
        :x1="shortenLeft ? dist * shorten : 0"
        :x2="shortenLeft ? dist * (1-shorten) : dist"
        class="bond"
      />
      <line
        :y1="shortenLeft ? 0 : -3.75"
        :y2="shortenLeft ? 0 : -3.75"
        :x1="shortenRight ? dist * shorten : 0"
        :x2="shortenRight ? dist * (1-shorten) : dist"
        class="bond"
      />
    </g>
    <g v-else-if="bond.bondOrder == 3">
      <line
        y1="5"
        y2="5"
        :x1="shortenLeft ? dist * shorten : 0"
        :x2="shortenLeft ? dist * (1-shorten) : dist"
        class="bond"
      />
      <line y1="0" y2="0" x1="0" :x2="dist" class="bond"/>
      <line
        y1="-5"
        y2="-5"
        :x1="shortenRight ? dist * shorten : 0"
        :x2="shortenRight ? dist * (1-shorten) : dist"
        class="bond"
      />
    </g>
  </g>
</template>
<script lang="ts">
import Vue from "vue";
import { Bond, BondState } from "../../models";
export default Vue.extend({
  props: {
    bond: Bond,
    transparent: Boolean
  },
  data() {
    return {
      visualState: 0,
      shorten: 2 / 7
    };
  },
  computed: {
    isSingleBond(): boolean {
      return this.bond.state === BondState.SINGLE;
    },
    isThicc(): boolean {
      return this.bond.state === BondState.THICK;
    },
    isApproachingBond(): boolean {
      return this.bond.state === BondState.FORWARD;
    },
    dist(): number {
      return Math.hypot(
        this.bond.start.x - this.bond.end.x,
        this.bond.start.y - this.bond.end.y
      );
    },
    angle(): number {
      return (
        (180 / Math.PI) *
        Math.atan2(
          this.bond.end.y - this.bond.start.y,
          this.bond.end.x - this.bond.start.x
        )
      );
    },
    classes(): string[] {
      const clazzes = ["bond"];
      if (this.transparent) {
        clazzes.push("transparent");
      }
      const start = this.bond.start;
      const end = this.bond.end;
      //   if (start.payload === elements[1 - 1]) {
      //     if (end.payload === elements[6 - 1]) {
      //       clazzes.push("omittable");
      //     }
      //   } else if (start.payload === elements[6 - 1]) {
      //     if (end.payload === elements[1 - 1]) {
      //       clazzes.push("omittable");
      //     }
      //   }
      return clazzes;
    }
  }
});
</script>
<style scoped>
.bond {
  stroke: black;
  stroke-width: 1;
}

.thonk {
  stroke-width: 10;
}

.partial {
  stroke-dasharray: 5 5;
}

.clickme {
  stroke: transparent;
  stroke-width: 25;
  pointer-events: all;
}

.transparent .clickme,
.transparent {
  pointer-events: none;
}
</style>
