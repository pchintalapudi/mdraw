<template>
  <svg
    overflow="auto"
    @pointermove.stop="handleMouseMove"
    @pointerdown.stop="handleMouseDown"
    @pointerup.stop="handleMouseUp"
    :viewBox="viewport"
    ref="svg"
  >
    <defs-vue></defs-vue>
    <slot></slot>
  </svg>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import DefsVue from "./defs/Defs.vue";
import { StateMachine, Action } from "@/state_machine";
export default Vue.extend({
  components: { "defs-vue": DefsVue },
  props: { stateMachine: Object as PropType<StateMachine> },
  data() {
    return { svg: (undefined as any) as SVGGraphicsElement };
  },
  mounted() {
    this.svg = this.$refs.svg as SVGGraphicsElement;
  },
  computed: {
    viewport(): number[] {
      return this.stateMachine.viewbox.viewport;
    },
    viewBox(): number[] {
      return this.stateMachine.viewbox.viewBox;
    }
  },
  methods: {
    transformPoint(payload: PointerEvent) {
      const pt = (this.svg as any).createSVGPoint() as SVGPoint;
      pt.x = payload.x;
      pt.y = payload.y;
      return pt.matrixTransform(this.svg.getScreenCTM()!.inverse());
    },
    handleMouseMove(payload: PointerEvent) {
      const pt = this.transformPoint(payload);
      this.stateMachine.execute(Action.MOUSE_MOVE, {
        target: "surface",
        payload: pt
      });
      const shift: [boolean, boolean, boolean, boolean] = [
        pt.x - this.viewport[0] < 50,
        pt.y - this.viewport[1] < 50,
        this.viewport[0] + this.viewport[2] - pt.x < 50,
        this.viewport[1] + this.viewport[3] - pt.y < 50
      ];
      if (shift[0]) {
        this.stateMachine.viewbox.viewX -= 10;
      } else if (shift[2]) {
        this.stateMachine.viewbox.viewX += 10;
      }
      if (shift[1]) {
        this.stateMachine.viewbox.viewY -= 10;
      } else if (shift[3]) {
        this.stateMachine.viewbox.viewY += 10;
      }
    },
    handleMouseUp(payload: PointerEvent) {
      this.stateMachine.execute(Action.MOUSE_UP, {
        target: "surface",
        payload: this.transformPoint(payload)
      });
    },
    handleMouseDown(payload: PointerEvent) {
      this.stateMachine.execute(Action.MOUSE_DOWN, {
        target: "surface",
        payload: this.transformPoint(payload)
      });
    }
  }
});
</script>
