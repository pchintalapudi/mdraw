<template>
  <div class="map">
    <svg
      :viewBox="viewBox"
      @pointerdown="mouseDown = true"
      @pointerup="mouseDown = false"
      @pointermove="move"
      @click.stop
      ref="svg"
    >
      <use href="#molecules"></use>
      <rect
        class="viewport"
        :x="viewport.x"
        :y="viewport.y"
        :width="viewport.width"
        :height="viewport.height"
      ></rect>
    </svg>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { StateMachine } from "@/state_machine";
export default Vue.extend({
  data() {
    return { mouseDown: false, svg: (undefined as any) as SVGGraphicsElement };
  },
  mounted() {
    this.svg = this.$refs.svg as SVGGraphicsElement;
  },
  props: { stateMachine: Object as PropType<StateMachine> },
  computed: {
    viewBox(): number[] {
      return this.stateMachine.viewbox.viewBox;
    },
    viewport(): { x: number; y: number; width: number; height: number } {
      const vp = this.stateMachine.viewbox.viewport;
      return { x: vp[0], y: vp[1], width: vp[2], height: vp[3] };
    }
  },
  methods: {
    transformPoint(payload: PointerEvent) {
      const pt = (this.svg as any).createSVGPoint() as SVGPoint;
      pt.x = payload.x;
      pt.y = payload.y;
      return pt.matrixTransform(this.svg.getScreenCTM()!.inverse());
    },
    move(ev: PointerEvent) {
      if (this.mouseDown) {
        const minx = this.viewBox[0] + this.viewport.width / 2;
        const maxx = this.viewBox[2] - this.viewport.width / 2;
        const miny = this.viewBox[1] + this.viewport.height / 2;
        const maxy = this.viewBox[3] - this.viewport.height / 2;
        const point = this.transformPoint(ev);
        this.stateMachine.viewbox.viewX = Math.min(
          maxx,
          Math.max(minx, point.x)
        );
        this.stateMachine.viewbox.viewY = Math.min(
          maxy,
          Math.max(miny, point.y)
        );
      }
    }
  }
});
</script>
<style scoped>
.viewport {
  fill: transparent;
  stroke: #0088ff;
  pointer-events: none;
}
.map {
  height: 80%;
  width: 80%;
  background-color: white;
}
</style>
