<template>
  <div class="map">
    <svg
      :viewBox="viewBox.serialized"
      @pointerdown.stop="pointerDown"
      @pointermove.stop="pointerMove"
      @pointerup.stop="pointerUp"
      @click.stop
      ref="svg"
      height="100%"
      width="100%"
      x="0"
      y="0"
    >
      <use href="#molecules"></use>
      <rect
        class="viewport"
        :x="viewPort.startX+.5"
        :y="viewPort.startY+.5"
        :width="viewPort.width - 1"
        :height="viewPort.height - 1"
      ></rect>
    </svg>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { StateMachine, Action, ViewPort, BoundingBox } from "@/state_machine";
export default Vue.extend({
  data() {
    return { mouseDown: false, svg: (undefined as any) as SVGGraphicsElement };
  },
  mounted() {
    this.svg = this.$refs.svg as SVGGraphicsElement;
  },
  props: { stateMachine: Object as PropType<StateMachine> },
  computed: {
    viewBox(): BoundingBox {
      return this.stateMachine.view.viewBox;
    },
    viewPort(): ViewPort {
      return this.stateMachine.view.viewPort;
    }
  },
  methods: {
    transformPoint(payload: { x: number; y: number }) {
      const pt = (this.svg as any).createSVGPoint() as SVGPoint;
      pt.x = payload.x;
      pt.y = payload.y;
      return pt.matrixTransform(this.svg.getScreenCTM()!.inverse());
    },
    pointerDown(event: PointerEvent) {
      this.stateMachine.execute(Action.MOUSE_DOWN, {
        target: "",
        payload: this.transformPoint(event),
        event
      });
    },
    pointerMove(event: PointerEvent) {
      this.stateMachine.execute(Action.MOUSE_MOVE, {
        target: "",
        payload: this.transformPoint(event),
        event
      });
    },
    pointerUp(event: PointerEvent) {
      this.$emit("stop-cancel");
      this.stateMachine.execute(Action.MOUSE_UP, {
        target: "",
        payload: this.transformPoint(event),
        event
      });
    }
  }
});
</script>
<style scoped>
.viewport {
  fill: transparent;
  stroke: #0088ff;
  stroke-width: 1;
  pointer-events: none;
}
.map {
  max-height: 80%;
  max-width: 80%;
  background-color: white;
}
</style>
