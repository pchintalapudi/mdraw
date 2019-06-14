<template>
  <g>
    <path :d="computedPath"></path>
    <polygon
      :transform="`translate(${endpoint[0]}, ${endpoint[1]}) rotate(${endpointAngle})`"
      points="0,5 0,-5 5,0"
      style="fill:black;stroke:transparent;pointer-events:none;"
    ></polygon>
  </g>
</template>
<script lang="ts">
import Vue from "vue";
import { CurvedArrow } from "../../models";
type ArrayPoint = [number, number];
type BezierCurve = [ArrayPoint, ArrayPoint, ArrayPoint, ArrayPoint];
export default Vue.extend({
  props: { arrow: CurvedArrow },
  computed: {
    bezierCoefficients(): BezierCurve[] {
      return this.arrow.computedCurve;
    },
    endpoint(): ArrayPoint {
      return this.bezierCoefficients[this.bezierCoefficients.length - 1][3];
    },
    endpointAngle(): number {
      const endCurve = this.bezierCoefficients[
        this.bezierCoefficients.length - 1
      ];
      return Math.atan2(
        endCurve[3][1] - endCurve[2][1],
        endCurve[3][0] - endCurve[2][0]
      );
    },
    computedPath(): string {
      return `
        M ${this.bezierCoefficients[0][0][0]} ${
        this.bezierCoefficients[0][0][1]
      } ${this.bezierCoefficients.map(bc => `C ${bc.slice(1).map(p => p.join(" ")).join(", ")}`).join(", ")}
        `;
    }
  }
});
</script>
