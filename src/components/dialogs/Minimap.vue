<template>
  <div class="map">
    <svg
      :viewBox="maxBox"
      @pointerdown.stop="pointerDown"
      @pointermove.stop="pointerMove"
      @pointerup.stop="pointerUp"
      @click.stop
      ref="svg"
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
  props: { stateMachine: Object as PropType<StateMachine>, triggered: Boolean },
  watch: {
    triggered() {
      this.stateMachine.execute(Action.MOUSE_UP, {
        target: "",
        payload: {
          x: this.viewPort.startX + this.viewPort.width / 2,
          y: this.viewPort.startY + this.viewPort.height / 2
        }
      });
    }
  },
  computed: {
    viewBox(): BoundingBox {
      return this.stateMachine.view.viewBox;
    },
    viewPort(): ViewPort {
      return this.stateMachine.view.viewPort;
    },
    maxBox(): number[] {
      const startX = Math.min(this.viewBox.startX, this.viewPort.startX),
        startY = Math.min(this.viewBox.startY, this.viewPort.startY);
      const width = Math.max(this.viewBox.endX, this.viewPort.endX) - startX;
      const height = Math.max(this.viewBox.endY, this.viewPort.endY) - startY;
      return [startX, startY, width, height];
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.map > svg {
  background-color: white;
  max-height: 80vh;
  max-width: 80vw;
}
</style>
