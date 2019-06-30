<template>
  <svg
    @pointermove.stop="handleMouseMove"
    @pointerdown.stop="handleMouseDown"
    @pointerup.stop="handleMouseUp"
    :viewBox="viewPort.serialized"
    ref="svg"
    :cursor="cursor"
  >
    <defs-vue></defs-vue>
    <slot></slot>
  </svg>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import DefsVue from "./defs/Defs.vue";
import { StateMachine, Action, State } from "@/state_machine";
import { ViewPort, BoundingBox } from "@/state_machine/extensions";
export default Vue.extend({
  components: { "defs-vue": DefsVue },
  props: { stateMachine: Object as PropType<StateMachine> },
  data() {
    return {
      svg: (undefined as any) as SVGGraphicsElement,
      mx: this.stateMachine.view.viewPort.width / 2,
      my: this.stateMachine.view.viewPort.height / 2,
      autoscroller: 0
    };
  },
  mounted() {
    this.svg = this.$refs.svg as SVGGraphicsElement;
  },
  computed: {
    viewPort(): ViewPort {
      return this.stateMachine.view.viewPort;
    },
    viewBox(): BoundingBox {
      return this.stateMachine.view.viewBox;
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
      return this.autoscroll && this.mx < this.viewPort.startX + 50;
    },
    scrollTop(): boolean {
      return this.autoscroll && this.my < this.viewPort.startY + 50;
    },
    scrollRight(): boolean {
      return this.autoscroll && this.mx > this.viewPort.endX - 50;
    },
    scrollBottom(): boolean {
      return this.autoscroll && this.my > this.viewPort.endY - 50;
    },
    needsScroll(): boolean {
      return (
        this.scrollLeft ||
        this.scrollTop ||
        this.scrollRight ||
        this.scrollBottom
      );
    },
    grabbing(): boolean {
      return this.stateMachine.stateVariables.ipos.length !== 0;
    },
    cursor(): string {
      if (this.stateMachine.state === State.PANNING) {
        if (this.grabbing) {
          return "grabbing";
        } else {
          return "grab";
        }
      } else {
        return "default";
      }
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
        payload: pt,
        event: payload instanceof PointerEvent ? payload : undefined
      });
      this.mx = pt.x;
      this.my = pt.y;
    },
    handleMouseUp(payload: PointerEvent) {
      this.stateMachine.execute(Action.MOUSE_UP, {
        target: "surface",
        payload: this.transformPoint(payload),
        event: payload
      });
    },
    handleMouseDown(payload: PointerEvent) {
      this.stateMachine.execute(Action.MOUSE_DOWN, {
        target: "surface",
        payload: this.transformPoint(payload),
        event: payload
      });
    },
    scroll() {
      const defaultDist = 10;
      if (this.scrollLeft) {
        const dist = Math.min(
          defaultDist,
          this.viewPort.startX - this.viewBox.startX
        );
        this.viewPort.startX -= dist;
        this.mx -= dist;
      }
      if (this.scrollTop) {
        const dist = Math.min(
          defaultDist,
          this.viewPort.startY - this.viewBox.startY
        );
        this.viewPort.startY -= dist;
        this.my -= dist;
      }
      if (this.scrollRight) {
        const dist = Math.min(
          defaultDist,
          this.viewBox.endX - this.viewPort.endX
        );
        this.viewPort.startX += dist;
        this.mx += dist;
      }
      if (this.scrollBottom) {
        const dist = Math.min(
          defaultDist,
          this.viewBox.endY - this.viewPort.startY
        );
        this.viewPort.startY += dist;
        this.my += dist;
      }
      this.handleMouseMove({ x: this.mx, y: this.my }, true);
    }
  }
});
</script>
