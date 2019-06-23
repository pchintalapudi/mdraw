<template>
  <g>
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
import {
  ArrayPoint,
  BezierCurve,
  deepCopy,
  shrink,
  bondControlPoint,
  getBondDistance
} from "../utils";
export default Vue.extend({
  props: { arrow: Object as PropType<CurvedArrow> },
  computed: {
    points(): Array<{ x: number; y: number }> {
      return this.arrow.draggablePoints;
    },
    bezierCoefficients(): BezierCurve[] {
      const rawCurve = deepCopy(this.arrow.computedCurve);
      if (this.arrow.points[0] instanceof RGroup) {
        rawCurve[0].splice(
          0,
          1,
          shrink(
            rawCurve[0][0],
            rawCurve[0][1],
            (this.arrow.points[0] as RGroup).payload.abbrev.length === 1
              ? 10
              : 15
          )
        );
      } else if (this.arrow.points[0] instanceof Bond) {
        const cp = bondControlPoint(rawCurve[0][1], this.arrow
          .points[0] as Bond);
        rawCurve[0].splice(
          0,
          2,
          shrink(
            rawCurve[0][0],
            cp,
            getBondDistance(this.arrow.points[0] as Bond, true)
          ),
          cp
        );
      }
      if (this.arrow.points[this.arrow.points.length - 1] instanceof RGroup) {
        rawCurve[rawCurve.length - 1].splice(
          3,
          1,
          shrink(
            rawCurve[rawCurve.length - 1][3],
            rawCurve[rawCurve.length - 1][2],
            (this.arrow.points[this.arrow.points.length - 1] as RGroup).payload
              .abbrev.length === 1
              ? 15
              : 25
          )
        );
      } else if (
        this.arrow.points[this.arrow.points.length - 1] instanceof Bond
      ) {
        const cp = bondControlPoint(rawCurve[rawCurve.length - 1][2], this.arrow
          .points[this.arrow.points.length - 1] as Bond);
        rawCurve[rawCurve.length - 1].splice(
          2,
          2,
          cp,
          shrink(
            rawCurve[rawCurve.length - 1][3],
            cp,
            getBondDistance(this.arrow.points[
              this.arrow.points.length - 1
            ] as Bond, false)
          )
        );
      }
      return rawCurve;
    },
    endpoint(): ArrayPoint {
      if (this.arrow.points.length === 2) {
        const point = this.arrow.points[1];
        return [point.x, point.y];
      }
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
      if (this.arrow.points.length === 2) {
        return `M ${this.arrow.points[0].x} ${this.arrow.points[0].y} L ${
          this.arrow.points[1].x
        } ${this.arrow.points[1].y}`;
      }
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
