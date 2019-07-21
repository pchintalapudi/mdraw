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
      <use href="#molecules" />
      <rect
        class="viewport"
        :x="viewPort.x+.5"
        :y="viewPort.y+.5"
        :width="viewPort.width - 1"
        :height="viewPort.height - 1"
      />
    </svg>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { StateMachine, Action } from "@/state_machine";
import { Rectangle } from "@/utils";
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
          x: this.viewPort.x + this.viewPort.width / 2,
          y: this.viewPort.y + this.viewPort.height / 2
        }
      });
    }
  },
  computed: {
    viewBox(): Rectangle {
      return this.stateMachine.view.viewBox;
    },
    viewPort(): Rectangle {
      return this.stateMachine.view.viewPort;
    },
    maxBox(): number[] {
      const x = Math.min(this.viewBox.x, this.viewPort.x),
        y = Math.min(this.viewBox.y, this.viewPort.y);
      const width = Math.max(this.viewBox.ex, this.viewPort.ex) - x;
      const height = Math.max(this.viewBox.ey, this.viewPort.ey) - y;
      return [x, y, width, height];
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
