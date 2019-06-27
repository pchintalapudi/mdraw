<template>
  <svg
    overflow="auto"
    @pointermove.stop="handleMouseMove"
    @pointerdown.stop="handleMouseDown"
    @pointerup.stop="handleMouseUp"
    :viewBox="viewBox"
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
    viewBox(): number[] {
      return this.stateMachine.viewbox.viewport;
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
      this.stateMachine.execute(Action.MOUSE_MOVE, {
        target: "surface",
        payload: this.transformPoint(payload)
      });
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
