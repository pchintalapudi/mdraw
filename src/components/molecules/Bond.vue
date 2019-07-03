<template>
  <g
    :transform="`translate(${bond.start.x} ${bond.start.y}) rotate(${angle})`"
    :class="classes"
    @pointerdown.stop="$emit('dmouse', {target:'bond', payload:bond, event:$event})"
    @pointermove.stop="$emit('mmouse', {target:'bond', payload:bond, event:$event})"
    @pointerup.stop="$emit('umouse', {target:'bond', payload:bond, event:$event})"
    @click.stop="$emit('click-bond', {target:'bond', payload:bond, event:$event})"
    @dblclick.stop="$emit('dblclick-bond', {target:'bond', payload:bond, event:$event})"
  >
    <line class="clickme" x1="0" y1="0" :x2="dist" y2="0"/>
    <rect
      v-if="showSingleLine"
      x="0"
      :y="-height / 2"
      :width="dist"
      :height="height"
      :fill="d3 ? patchy ? 'url(#patchy-d3bond)': 'url(#d3bond)' : patchy ? 'url(#patchy)' :  'black'"
      stroke="transparent"
    />
    <polygon
      v-else-if="bond.bondOrder == 1"
      :style="`fill: ${isApproachingBond ? 'black' : 'url(#patchy)'};stroke:transparent`"
      :points="`0,0 ${this.dist - 10},5 ${this.dist - 10},-5`"
    ></polygon>
    <template v-else-if="bond.bondOrder == 2">
      <rect
        :x="doubleStartLeft"
        :y="doubleDown - height / 2"
        :height="height"
        :width="doubleEndLeft - doubleStartLeft"
        stroke="transparent"
        :fill="d3 ? 'url(#d3bond)' : 'black'"
      />
      <rect
        :x="doubleStartRight"
        :y="doubleUp - height / 2"
        :height="height"
        :width="doubleEndRight - doubleStartRight"
        stroke="transparent"
        :fill="d3 ? 'url(#d3bond)' : 'black'"
      />
    </template>
    <template v-else-if="bond.bondOrder == 3">
      <rect
        :x="doubleStartLeft"
        :width="doubleEndLeft - doubleStartLeft"
        :y="5 - height / 2"
        :height="height"
        stroke="transparent"
        :fill="d3 ? 'url(#d3bond)' : 'black'"
      />
      <rect
        x="0"
        :y="-height / 2"
        :width="dist"
        :height="height"
        stroke="transparent"
        :fill="d3 ? 'url(#d3bond)' : 'black'"
      />
      <rect
        :x="doubleStartRight"
        :width="doubleEndRight - doubleStartRight"
        :y="-5 - height / 2"
        :height="height"
        stroke="transparent"
        :fill="d3 ? 'url(#d3bond)' : 'black'"
      />
    </template>
  </g>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { Bond, BondState } from "../../models";
export default Vue.extend({
  props: {
    bond: Object as PropType<Bond>,
    transparent: Boolean,
    omitting: Boolean,
    d3: Boolean
  },
  data() {
    return {
      shortenVisible: 2 / 7,
      shortenOmitted: 1 / 7
    };
  },
  computed: {
    showSingleLine(): boolean {
      return (
        this.bond.state === BondState.SINGLE ||
        !this.bond.bondOrder ||
        this.bond.state === BondState.THICK ||
        (this.bond.bondOrder === 1 && this.d3)
      );
    },
    patchy(): boolean {
      return this.bond.bondOrder === 0;
    },
    height(): number {
      switch (this.bond.state) {
        default:
          return this.d3 ? 10 : 1;
        case BondState.THICK:
          return 10;
        case BondState.DOUBLE:
        case BondState.DOUBLE_LEFT:
        case BondState.DOUBLE_RIGHT:
          return this.d3 ? 7 : 1;
        case BondState.TRIPLE:
        case BondState.TRIPLE_SHORT:
          return this.d3 ? 5 : 1;
      }
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
      const clazzes: string[] = [];
      if (this.d3) {
        clazzes.push("d3");
      } else if (this.omittable()) {
        clazzes.push("omittable");
      }
      if (this.transparent) {
        clazzes.push("transparent");
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
      return (this.bond.state === BondState.DOUBLE_LEFT ||
        this.bond.state === BondState.TRIPLE_SHORT) &&
        !this.d3
        ? 0
        : 3.75;
    },
    doubleDown(): number {
      return (this.bond.state === BondState.DOUBLE_RIGHT ||
        this.bond.state === BondState.TRIPLE_SHORT) &&
        !this.d3
        ? 0
        : -3.75;
    },
    doubleStartLeft(): number {
      return (this.bond.state === BondState.DOUBLE_LEFT ||
        this.bond.state === BondState.TRIPLE_SHORT) &&
        !this.d3
        ? this.dist * this.shortenStart
        : 0;
    },
    doubleStartRight(): number {
      return (this.bond.state === BondState.DOUBLE_RIGHT ||
        this.bond.state === BondState.TRIPLE_SHORT) &&
        !this.d3
        ? this.dist * this.shortenStart
        : 0;
    },
    doubleEndLeft(): number {
      return (this.bond.state === BondState.DOUBLE_LEFT ||
        this.bond.state === BondState.TRIPLE_SHORT) &&
        !this.d3
        ? this.dist * (1 - this.shortenEnd)
        : this.dist;
    },
    doubleEndRight(): number {
      return (this.bond.state === BondState.DOUBLE_RIGHT ||
        this.bond.state === BondState.TRIPLE_SHORT) &&
        !this.d3
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
.d3 .double.bond {
  stroke-width: 7;
}

.d3 .triple.bond {
  stroke-width: 5;
}

.thick {
  stroke-width: 10;
}

.clickme {
  stroke: transparent;
  stroke-width: 25;
  pointer-events: all;
}

.transparent .clickme {
  pointer-events: none;
}
</style>
