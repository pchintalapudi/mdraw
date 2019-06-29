<template>
  <svg
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
import { StateMachine, Action, State } from "@/state_machine";
export default Vue.extend({
  components: { "defs-vue": DefsVue },
  props: { stateMachine: Object as PropType<StateMachine> },
  data() {
    return {
      svg: (undefined as any) as SVGGraphicsElement,
      mx: this.stateMachine.viewbox.viewWidth / 2,
      my: this.stateMachine.viewbox.viewHeight / 2,
      autoscroller: 0
    };
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
    },
    autoscroll(): boolean {
      switch (this.stateMachine.state) {
        default:
          return true;
        case State.MAPPING:
        case State.ANGLING_LONE_PAIR:
        case State.IDLE:
        case State.PANNING:
        case State.ROTATING:
        case State.ANGLING_STRAIGHT_ARROW:
          return false;
      }
    },
    scrollLeft(): boolean {
      return this.autoscroll && this.mx < this.stateMachine.viewbox.viewX + 50;
    },
    scrollTop(): boolean {
      return this.autoscroll && this.my < this.stateMachine.viewbox.viewY + 50;
    },
    scrollRight(): boolean {
      return (
        this.autoscroll &&
        this.mx >
          this.stateMachine.viewbox.viewX +
            this.stateMachine.viewbox.viewWidth -
            50
      );
    },
    scrollBottom(): boolean {
      return (
        this.autoscroll &&
        this.my >
          this.stateMachine.viewbox.viewY +
            this.stateMachine.viewbox.viewHeight -
            50
      );
    },
    needsScroll(): boolean {
      return (
        this.scrollLeft ||
        this.scrollTop ||
        this.scrollRight ||
        this.scrollBottom
      );
    }
  },
  watch: {
    needsScroll(next) {
      if (next) {
        this.autoscroller = window.setInterval(() => this.scroll(), 25);
      } else {
        window.clearInterval(this.autoscroller);
      }
    }
  },
  methods: {
    transformPoint(payload: { x: number; y: number }) {
      const pt = (this.svg as any).createSVGPoint() as SVGPoint;
      pt.x = payload.x;
      pt.y = payload.y;
      return pt.matrixTransform(this.svg.getScreenCTM()!.inverse());
    },
    handleMouseMove(payload: { x: number; y: number }, transformed = false) {
      const pt = transformed ? payload : this.transformPoint(payload);
      this.stateMachine.execute(Action.MOUSE_MOVE, {
        target: "surface",
        payload: pt
      });
      this.mx = pt.x;
      this.my = pt.y;
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
    },
    scroll() {
      const defaultDist = 10;
      if (this.scrollLeft) {
        const dist = Math.min(
          defaultDist,
          this.stateMachine.viewbox.viewX - this.viewBox[0]
        );
        this.stateMachine.viewbox.viewX -= dist;
        this.mx -= dist;
      }
      if (this.scrollTop) {
        const dist = Math.min(
          defaultDist,
          this.stateMachine.viewbox.viewY - this.viewBox[1]
        );
        this.stateMachine.viewbox.viewY -= dist;
        this.my -= dist;
      }
      if (this.scrollRight) {
        const dist = Math.min(
          defaultDist,
          this.viewBox[0] +
            this.viewBox[2] -
            (this.stateMachine.viewbox.viewX +
              this.stateMachine.viewbox.viewWidth)
        );
        this.stateMachine.viewbox.viewX += dist;
        this.mx += dist;
      }
      if (this.scrollBottom) {
        const dist = Math.min(
          defaultDist,
          this.viewBox[1] +
            this.viewBox[3] -
            (this.stateMachine.viewbox.viewY +
              this.stateMachine.viewbox.viewHeight)
        );
        this.stateMachine.viewbox.viewY += dist;
        this.my += dist;
      }
      this.handleMouseMove({ x: this.mx, y: this.my }, true);
    }
  }
});
</script>
