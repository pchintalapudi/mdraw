<template>
  <g :display="d3 ? false : false">
    <path
      v-if="this.arrow.points.length > 2"
      :d="computedPath"
      style="fill:transparent;stroke:black;pointer-events:none;"
    ></path>
    <line
      v-else-if="!showNothing"
      :x1="line[0].x"
      :y1="line[0].y"
      :x2="line[1].x"
      :y2="line[1].y"
      fill="transparent"
      stroke="black"
    ></line>
    <polygon
      v-if="!showNothing"
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
  props: {
    arrow: Object as PropType<CurvedArrow>,
    d3: Boolean,
    transparent: Boolean
  },
  computed: {
    points(): Array<{ x: number; y: number }> {
      return this.arrow.draggablePoints;
    },
    bezierCoefficients(): BezierCurve[] {
      return this.arrow.curve;
    },
    showNothing(): boolean {
      return isNaN(this.bezierCoefficients[0][0][0]);
    },
    line(): [{ x: number; y: number }, { x: number; y: number }] {
      return [
        {
          x: this.bezierCoefficients[0][0][0],
          y: this.bezierCoefficients[0][0][1]
        },
        {
          x: this.bezierCoefficients[0][3][0],
          y: this.bezierCoefficients[0][3][1]
        }
      ];
    },
    endpoint(): ArrayPoint {
      return this.arrow.points.length > 2
        ? this.bezierCoefficients[this.bezierCoefficients.length - 1][3]
        : [this.line[1].x, this.line[1].y];
    },
    endpointAngle(): number {
      const endCurve = this.bezierCoefficients[
        this.bezierCoefficients.length - 1
      ];
      return (
        ((this.bezierCoefficients.length > 1
          ? Math.atan2(
              endCurve[3][1] - endCurve[2][1],
              endCurve[3][0] - endCurve[2][0]
            )
          : Math.atan2(
              this.line[1].y - this.line[0].y,
              this.line[1].x - this.line[0].x
            )) *
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
        M ${this.bezierCoefficients[0][0][0]} ${this.bezierCoefficients[0][0][1]} ${this.mappedCoeffs}`;
    },
    classes(): string[] {
      const clazzes = [] as string[];
      if (this.transparent) clazzes.push("transparent");
      return clazzes;
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
