<template>
  <g id="angler">
    <path :d="path"/>
    <text :x="bond.start.x + dist" :y="bond.start.y - dist">{{description}}</text>
  </g>
</template>
<script lang="ts">
import Vue from "vue";
import { Bond } from "../../../models";
import { defaultBondDist } from "../../../constants";
export default Vue.extend({
  data: function() {
    return { dist: defaultBondDist };
  },
  computed: {
    bond(): Bond {
      return this.$store.state.molecules.stateMachine.adding!;
    },
    lastAngle(): number {
      return this.$store.state.molecules.stateMachine.lastAngle;
    },
    angle(): number {
      return (
        360 -
        ((360 +
          (Math.atan2(
            this.bond.end.y - this.bond.start.y,
            this.bond.end.x - this.bond.start.x
          ) *
            180) /
            Math.PI) %
          360)
      );
    },
    raw() {
      return (
        ((this.angle as any) +
          ((this.lastAngle as any) * 180) / Math.PI +
          360) %
        360
      );
    },
    path() {
      return (
        "M" +
        (this.bond as any).start.x +
        " " +
        (this.bond as any).start.y +
        "L" +
        ((this.bond as any).start.x + Math.cos(this.lastAngle as any) * defaultBondDist) +
        " " +
        ((this.bond as any).start.y + Math.sin(this.lastAngle as any) * defaultBondDist) +
        ' ' +
        'A' +
        ' ' +
        defaultBondDist +
        ' ' +
        defaultBondDist +
        ' ' +
        0 +
        ' ' +
        0 +
        ' '+
        (this.raw as any > 180 ? 1 : 0) +
        ' ' +
        (this.bond as any).end.x +
        ' ' +
        (this.bond as any).end.y
      );
    },
    description() {
      let raw =
        ((this.angle as any) +
          ((this.lastAngle as any) * 180) / Math.PI +
          360) %
        360;
      return (
        (raw > 180 ? Number((raw - 360).toFixed(3)) : Number(raw.toFixed(3))) +
        "°"
      );
    },
    rotate(): string {
      return "rotate(" + (this.lastAngle * 180) / Math.PI + ")";
    }
  }
});
</script>
