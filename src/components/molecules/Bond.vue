<template>
  <g
    @pointerdown.stop="$emit('dmouse', {target:'bond', payload:bond, event:$event})"
    @pointermove.stop="$emit('mmouse', {target:'bond', payload:bond, event:$event})"
    @pointerup.stop="$emit('umouse', {target:'bond', payload:bond, event:$event})"
    @click.stop="$emit('click-bond', {target:'bond', payload:bond, event:$event})"
    @dblclick.stop="$emit('dblclick-bond', {target:'bond', payload:bond, event:$event})"
    :style="`--x:${bond.start.x}px;--y:${bond.start.y}px;--angle:${this.angle}rad;
            pointer-events:${transparent ? 'none' : 'all'}`"
    class="positioned bond"
  >
    <rect x="0" y="-12.5" height="25" :width="dist" fill="transparent" />
    <polygon v-if="showPolygon" :style="polygonFill" :points="`0,0 ${polygonX},5 ${polygonX},-5`"></polygon>
    <rect
      v-else-if="bond.bondOrder !== 2"
      :width="dist"
      :height="height"
      class="positioned"
      :style="`--y:${-height / 2}px;
      ${!bond.bondOrder ? `fill:${d3 ? 'url(#patchy-d3bond)' : 'url(#patchy)'}` : ''}`"
    />
    <template v-if="bond.bondOrder > 1">
      <rect
        x="0"
        y="0"
        height="1"
        width="1"
        class="positioned"
        :style="`--x:${doubleStartLeft}px;--y:${doubleDown}px;--sy:${height};--sx:${doubleDistLeft};`"
      />
      <rect
        x="0"
        y="0"
        height="1"
        width="1"
        class="positioned"
        :style="`--x:${doubleStartRight}px;--y:${doubleUp}px;--sy:${height};--sx:${doubleDistRight};`"
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
  created() {
    const options = this.$options as any;
    options.shortenVisible = 2 / 7;
    options.shortenOmitted = 1 / 7;
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
        ? "fill:black"
        : "fill:url(#patchy)";
    },
    difX(): number {
      return this.bond.end.x - this.bond.start.x;
    },
    difY(): number {
      return this.bond.end.y - this.bond.start.y;
    },
    dist(): number {
      return Math.hypot(this.difX, this.difY);
    },
    angle(): number {
      return Math.atan2(this.difY, this.difX);
    },
    shortenStart(): number {
      return this.bond.start.softOmittable && this.omitting
        ? (this.$options as any).shortenOmitted
        : (this.$options as any).shortenVisible;
    },
    shortenEnd(): number {
      return this.bond.end.softOmittable && this.omitting
        ? (this.$options as any).shortenOmitted
        : (this.$options as any).shortenVisible;
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
    }
  }
});
</script>
