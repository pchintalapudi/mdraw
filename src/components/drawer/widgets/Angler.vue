<template>
  <g id="angler">
    <path :d="path"/>
    <text :x="bond.start.x + dist" :y="bond.start.y - dist">{{description}}</text>
  </g>
</template>
<script lang="ts">
import Vue from "vue";
import { Bond } from "../../../models";
export default Vue.extend({
  computed: {
    bond(): Bond {
      return this.$store.state.molecules.stateMachine.adding!;
    },
    dist(): number {
      return this.$store.state.defaultDist;
    },
    angle(): number {
      return (
        (630 -
          (((Math.atan2(
            this.bond.end.y - this.bond.start.y,
            this.bond.end.x - this.bond.start.x
          ) *
            180) /
            Math.PI +
            270) %
            360)) %
        360
      );
    },
    path() {
      return (
        "M" +
        (this.bond as any).start.x +
        " " +
        (this.bond as any).start.y +
        " h " +
        this.dist +
        " A " +
        this.dist +
        " " +
        this.dist +
        ", 0," +
        ((this.angle as any) < 180 ? " 0, 0," : " 1, 0,") +
        " " +
        (this.bond as any).end.x +
        " " +
        (this.bond as any).end.y +
        " L " +
        (this.bond as any).start.x +
        " " +
        (this.bond as any).start.y
      );
    },
    description() {
      return Number((this.angle as any).toFixed(3)) + "°";
    }
  }
});
</script>
