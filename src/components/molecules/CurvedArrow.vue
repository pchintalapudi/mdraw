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
import { CurvedArrow } from "../../models";
import { RGroup } from "@/models";
type ArrayPoint = [number, number];
type BezierCurve = [ArrayPoint, ArrayPoint, ArrayPoint, ArrayPoint];

function deepCopy(curves: BezierCurve[]): BezierCurve[] {
  const copy = [];
  for (const curve of curves) {
    const curveCopy = [];
    for (const point of curve) {
      curveCopy.push([point[0], point[1]]);
    }
    copy.push(curveCopy as BezierCurve);
  }
  return copy;
}

function shrink(start: ArrayPoint, end: ArrayPoint, dist: number): ArrayPoint {
  const v1 = end[0] - start[0];
  const v2 = end[1] - start[1];
  const d = Math.hypot(v1, v2);
  return [start[0] + (v1 / d) * dist, start[1] + (v2 / d) * dist];
}
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
              ? 15
              : 25
          )
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
      }
      return rawCurve;
    },
    bezierPoints(): ArrayPoint[] {
      const points: ArrayPoint[] = [];
      for (const coefs of this.bezierCoefficients) points.push(...coefs);
      points.pop();
      return points;
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
