<template>
  <g :display="d3 ? 'none' : false">
    <path :d="computedPath" style="fill:transparent;stroke:black;pointer-events:none;"></path>
    <polygon
      :transform="`translate(${endpoint[0]}, ${endpoint[1]}) rotate(${endpointAngle})`"
      points="0,5 0,-5 5,0"
      style="fill:black;stroke:transparent;pointer-events:none;"
    ></polygon>
    <circle
      v-for="(point, idx) in points"
      :key="'target-' + idx"
      :cx="point.x"
      :cy="point.y"
      r="5"
      class="target"
    ></circle>
  </g>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { RGroup, Bond, CurvedArrow } from "@/models";
import { ArrayPoint, BezierCurve } from "@/utils";
export default Vue.extend({
  props: { arrow: Object as PropType<CurvedArrow>, d3: Boolean },
  computed: {
    points(): Array<{ x: number; y: number }> {
      return this.arrow.draggablePoints;
    },
    bezierCoefficients(): BezierCurve[] {
      return this.arrow.curve;
    },
    endpoint(): ArrayPoint {
      return this.bezierCoefficients[this.bezierCoefficients.length - 1][3];
    },
    endpointAngle(): number {
      const endCurve = this.bezierCoefficients[
        this.bezierCoefficients.length - 1
      ];
      return (
        (Math.atan2(
          endCurve[3][1] - endCurve[2][1],
          endCurve[3][0] - endCurve[2][0]
        ) *
          180) /
        Math.PI
      );
    },
    mappedCoeffs(): string {
      return this.bezierCoefficients
        .map(
          bc =>
            `C ${bc
              .slice(1)
              .map(p => p.join(" "))
              .join(", ")}`
        )
        .join(" ");
    },
    computedPath(): string {
      return `
        M ${this.bezierCoefficients[0][0][0]} ${
        this.bezierCoefficients[0][0][1]
      } ${this.mappedCoeffs}`;
    }
  }
});
</script>
<style scoped>
.target {
  fill: transparent;
}
.target:hover {
  fill: blue;
  pointer-events: all;
}
</style>
