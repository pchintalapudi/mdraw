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
  const a1 = start[0],
    a2 = start[1];
  const b1 = end[0],
    b2 = end[1];
  const v1 = b1 - a1,
    v2 = b2 - a2;
  const d = Math.hypot(v1, v2);
  const u1 = v1 / d,
    u2 = v2 / d;
  const f1 = a1 + u1 * dist,
    f2 = a2 + u2 * dist;
  return [f1, f2];
}
export default Vue.extend({
  props: { arrow: Object as PropType<CurvedArrow> },
  computed: {
    points(): Array<{ x: number; y: number }> {
      return this.arrow.draggablePoints;
    },
    bezierCoefficients(): BezierCurve[] {
      const rawCurve = deepCopy(this.arrow.computedCurve);
      if (this.arrow.rawPoints[0] instanceof RGroup) {
        rawCurve[0][0] = shrink(
          rawCurve[0][0],
          rawCurve[0][1],
          (this.arrow.rawPoints[0] as RGroup).payload.abbrev.length === 1
            ? 15
            : 25
        );
      }
      if (
        this.arrow.rawPoints[this.arrow.rawPoints.length - 1] instanceof RGroup
      ) {
        rawCurve[rawCurve.length - 1][3] = shrink(
          rawCurve[rawCurve.length - 1][3],
          rawCurve[rawCurve.length - 1][2],
          (this.arrow.rawPoints[this.arrow.rawPoints.length - 1] as RGroup)
            .payload.abbrev.length === 1
            ? 15
            : 25
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
      if (this.arrow.rawPoints.length === 2) {
        const point = this.arrow.rawPoints[1];
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
      if (this.arrow.rawPoints.length === 2) {
        return `M ${this.arrow.rawPoints[0].x} ${this.arrow.rawPoints[0].y} L ${
          this.arrow.rawPoints[1].x
        } ${this.arrow.rawPoints[1].y}`;
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
