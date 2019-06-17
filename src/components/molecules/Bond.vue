<template>
  <g
    :transform="`translate(${bond.start.x} ${bond.start.y}) rotate(${angle})`"
    :class="classes"
    @pointerdown.stop="$emit('dmouse', bond)"
    @pointermove.stop="$emit('mmouse', bond)"
    @pointerup.stop="$emit('umouse', bond)"
    @click.stop="$emit('click-bond', bond)"
    @dblclick.stop="$emit('dblclick-bond', bond)"
  >
    <line class="clickme" x1="0" y1="0" :x2="dist" y2="0"/>
    <line
      v-if="isSingleBond || !bond.bondOrder || isThick"
      x1="0"
      :x2="dist"
      y1="0"
      y2="0"
      :class="`${(bond.bondOrder ? isThick ? 'thick' : 'single' : 'partial')} bond`"
    />
    <polygon
      v-else-if="bond.bondOrder == 1"
      :style="`fill: ${isApproachingBond ? 'black' : 'url(#patchy)'};stroke:transparent`"
      :points="`0,0 ${this.dist - 10},5 ${this.dist - 10},-5`"
    ></polygon>
    <g v-else-if="bond.bondOrder == 2">
      <line
        :y1="doubleDown"
        :y2="doubleDown"
        :x1="doubleStartLeft"
        :x2="doubleEndLeft"
        class="bond"
      />
      <line :y1="doubleUp" :y2="doubleUp" :x1="doubleStartRight" :x2="doubleEndRight" class="bond"/>
    </g>
    <g v-else-if="bond.bondOrder == 3">
      <line y1="5" y2="5" :x1="doubleStartLeft" :x2="doubleEndLeft" class="bond"/>
      <line y1="0" y2="0" x1="0" :x2="dist" class="bond"/>
      <line y1="-5" y2="-5" :x1="doubleStartRight" :x2="doubleEndRight" class="bond"/>
    </g>
  </g>
</template>
<script lang="ts">
import Vue from "vue";
import { Bond, BondState } from "../../models";
export default Vue.extend({
  props: {
    bond: Bond,
    transparent: Boolean,
    omitting: Boolean
  },
  data() {
    return {
      shortenVisible: 2 / 7,
      shortenOmitted: 1 / 7
    };
  },
  computed: {
    bondOrder(): number {
      return this.bond.bondOrder;
    },
    isSingleBond(): boolean {
      return this.bond.state === BondState.SINGLE;
    },
    isThick(): boolean {
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
      if (this.omittable()) {
        clazzes.push("omittable");
      }
      const start = this.bond.start;
      const end = this.bond.end;
      return clazzes;
    },
    shortenStart(): number {
      return this.rgroupOmittable(true) && this.omitting
        ? this.shortenOmitted
        : this.shortenVisible;
    },
    shortenEnd(): number {
      return this.rgroupOmittable(false) && this.omitting
        ? this.shortenOmitted
        : this.shortenVisible;
    },
    doubleUp(): number {
      return this.bond.state === BondState.DOUBLE_LEFT ||
        this.bond.state === BondState.TRIPLE_SHORT
        ? 0
        : 3.75;
    },
    doubleDown(): number {
      return this.bond.state === BondState.DOUBLE_RIGHT ||
        this.bond.state === BondState.TRIPLE_SHORT
        ? 0
        : -3.75;
    },
    doubleStartLeft(): number {
      return this.bond.state === BondState.DOUBLE_LEFT ||
        this.bond.state === BondState.TRIPLE_SHORT
        ? this.dist * this.shortenStart
        : 0;
    },
    doubleStartRight(): number {
      return this.bond.state === BondState.DOUBLE_RIGHT ||
        this.bond.state === BondState.TRIPLE_SHORT
        ? this.dist * this.shortenStart
        : 0;
    },
    doubleEndLeft(): number {
      return this.bond.state === BondState.DOUBLE_LEFT ||
        this.bond.state === BondState.TRIPLE_SHORT
        ? this.dist * (1 - this.shortenEnd)
        : this.dist;
    },
    doubleEndRight(): number {
      return this.bond.state === BondState.DOUBLE_RIGHT ||
        this.bond.state === BondState.TRIPLE_SHORT
        ? this.dist * (1 - this.shortenEnd)
        : this.dist;
    }
  },
  methods: {
    rgroupOmittable(start: boolean): boolean {
      return start
        ? this.bond.start.softOmittable || this.bond.start.omittable
        : this.bond.end.softOmittable || this.bond.end.omittable;
    },
    omittable(): boolean {
      return this.bond.omittable;
    }
  }
});
</script>
<style scoped>
.bond {
  stroke: black;
  stroke-width: 1;
}

.thick {
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
