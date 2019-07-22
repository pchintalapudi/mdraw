<template>
  <g
    @pointerdown.stop="$emit('dmouse', {target:'bond', payload:bond, event:$event})"
    @pointermove.stop="$emit('mmouse', {target:'bond', payload:bond, event:$event})"
    @pointerup.stop="$emit('umouse', {target:'bond', payload:bond, event:$event})"
    @click.stop="$emit('click-bond', {target:'bond', payload:bond, event:$event})"
    @dblclick.stop="$emit('dblclick-bond', {target:'bond', payload:bond, event:$event})"
    :style="rootStyle"
    class="positioned bond"
  >
    <rect x="0" y="-12.5" height="25" :width="dist" fill="transparent" />
    <polygon v-if="showPolygon" :fill="polygonFill" :points="`0,0 ${polygonX},5 ${polygonX},-5`"></polygon>
    <rect
      v-else-if="singleBond"
      :width="dist"
      :height="height"
      class="positioned"
      :fill="this.bond.bondOrder === 0 ? this.d3 ? 'url(#patchy-d3bond)' : 'url(#patchy)' : false"
      :style="`--y:${-height / 2}px;`"
    />
    <template v-if="flairs">
      <rect x="0" y="0" height="1" width="1" class="positioned" :style="rect1Style" />
      <rect x="0" y="0" height="1" width="1" class="positioned" :style="rect2Style" />
    </template>
  </g>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { Bond, BondState } from "@/models";

function blur(num: number) {
  const int = num + 0.000005;
  return int - (int % 0.00001);
}

const shortenOmitted = 1 / 7;
const shortenVisible = 2 / 7;

export default Vue.extend({
  props: {
    bond: Object as PropType<Bond>,
    omitting: Boolean,
    d3: Boolean
  },
  computed: {
    showPolygon(): boolean {
      return (
        !this.d3 &&
        (this.bond.state === BondState.FORWARD ||
          this.bond.state === BondState.RETREATING)
      );
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
    polygonFill(): string {
      return this.bond.state === BondState.FORWARD
        ? "black"
        : "url(#patchy)";
    },
    difX(): number {
      return blur(this.bond.end.x - this.bond.start.x);
    },
    difY(): number {
      return blur(this.bond.end.y - this.bond.start.y);
    },
    dist(): number {
      return blur(Math.hypot(this.difX, this.difY));
    },
    angle(): number {
      return blur(Math.atan2(this.difY, this.difX));
    },
    shortenStart(): number {
      return this.bond.start.softOmittable && this.omitting
        ? shortenOmitted
        : shortenVisible;
    },
    shortenEnd(): number {
      return this.bond.end.softOmittable && this.omitting
        ? shortenOmitted
        : shortenVisible;
    },
    doubleUp(): number {
      return (
        (this.d3
          ? this.bond.bondOrder === 3
            ? 5
            : 3.5
          : this.bond.state === BondState.DOUBLE_LEFT
          ? 0
          : 3.75) -
        this.height / 2
      );
    },
    doubleDown(): number {
      return (
        (this.d3
          ? this.bond.bondOrder === 3
            ? -5
            : -3.75
          : this.bond.state === BondState.DOUBLE_RIGHT
          ? 0
          : -3.75) -
        this.height / 2
      );
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
    doubleDistLeft(): number {
      return this.d3
        ? this.dist
        : this.bond.state === BondState.DOUBLE_LEFT ||
          this.bond.state === BondState.TRIPLE_SHORT
        ? this.dist * (1 - this.shortenStart - this.shortenEnd)
        : this.dist;
    },
    doubleDistRight(): number {
      return this.d3
        ? this.dist
        : this.bond.state === BondState.DOUBLE_RIGHT ||
          this.bond.state === BondState.TRIPLE_SHORT
        ? this.dist * (1 - this.shortenStart - this.shortenEnd)
        : this.dist;
    },
    polygonX(): number {
      return this.bond.end.softOmittable && this.omitting
        ? this.dist
        : this.dist - this.bond.end.radius;
    },
    rootStyle(): string {
      return `--x:${this.bond.start.x}px;--y:${this.bond.start.y}px;--angle:${this.angle}rad;`;
    },
    rect1Style(): string {
      return `--x:${this.doubleStartLeft}px;--y:${this.doubleDown}px;--sy:${this.height};--sx:${this.doubleDistLeft};`;
    },
    rect2Style(): string {
      return `--x:${this.doubleStartRight}px;--y:${this.doubleUp}px;--sy:${this.height};--sx:${this.doubleDistRight};`;
    },
    singleBond(): boolean {
      return this.bond.bondOrder !== 2;
    },
    flairs(): boolean {
      return this.bond.bondOrder > 1;
    }
  }
});
</script>
