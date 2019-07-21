<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    @pointermove.stop="handleMouseMove"
    @pointerdown.stop="handleMouseDown"
    @pointerup.stop="handleMouseUp"
    :viewBox="printing ? viewBox.serialized : `0 0 ${viewPort.width} ${viewPort.height}`"
    ref="svg"
    :cursor="cursor"
    :width="printing ? viewBox.width : '100%'"
    :height="printing ? viewBox.height : '100%'"
  >
    <defs-vue />
    <defs
      v-html="`
      <style>
        .positioned {
          transform:translate(var(--x),var(--y)) rotate(var(--angle)) scale(var(--sx), var(--sy));
          transform-origin:var(--tx) var(--ty);
        }

        .positioned > * {
          --x:0;
          --y:0;
          --sx:1;
          --sy:1;
          --angle:0deg;
          --tx:center;
          --ty:center;
        }

        svg > .positioned {
          transition:transform ${$options.frameTime}ms linear
        }

        text {
          cursor:default;
          user-select:none;
        }

        .bond {
          fill:${d3 ? 'url(#d3bond)' : 'black'};
          stroke:transparent;
          --tx:0px;
          --ty:0px;
        }

        .bond > * {
          --tx:0px;
          --ty:0px;
        }
      </style>`"
    />
    <g
      class="positioned"
      :style="`--x:${printing ? 0 : -viewPort.x}px;--y:${printing ? 0 : -viewPort.y}px;
              --angle:0;--tx:center;--ty:center;--sx:1;--sy:1;`"
    >
      <slot />
    </g>
  </svg>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import DefsVue from "./defs/Defs.vue";
import { StateMachine, Action, State } from "@/state_machine";
import { Constants, Rectangle } from "@/utils";
export default Vue.extend({
  components: { "defs-vue": DefsVue },
  props: {
    stateMachine: Object as PropType<StateMachine>,
    printing: Boolean,
    d3: Boolean
  },
  created() {
    (this.$options as any).frameTime = Constants.frameTime;
  },
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
    viewPort(): Rectangle {
      return this.stateMachine.view.viewPort;
    },
    viewBox(): Rectangle {
      return this.stateMachine.view.viewBox;
    },
    autoscroll(): boolean {
      switch (this.stateMachine.state) {
        default:
          return (
            this.stateMachine.stateVariables.rgroups.length !== 0 ||
            this.stateMachine.stateVariables.straightArrows.length !== 0
          );
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
      return (
        this.autoscroll &&
        this.mx < Constants.screenScrollWidth + this.viewPort.x
      );
    },
    scrollTop(): boolean {
      return (
        this.autoscroll &&
        this.my < Constants.screenScrollWidth + this.viewPort.y
      );
    },
    scrollRight(): boolean {
      return (
        this.autoscroll &&
        this.mx >
          this.viewPort.width -
            Constants.screenScrollWidth +
            this.viewPort.x
      );
    },
    scrollBottom(): boolean {
      return (
        this.autoscroll &&
        this.my >
          this.viewPort.height -
            Constants.screenScrollWidth +
            this.viewPort.y
      );
    },
    needsScroll(): boolean {
      return (
        this.scrollLeft ||
        this.scrollTop ||
        this.scrollRight ||
        this.scrollBottom
      );
    },
    cursor(): string {
      if (this.stateMachine.state === State.PANNING) {
        if (this.stateMachine.stateVariables.temp.number) {
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
        this.autoscroller = window.setInterval(
          () => this.scroll(),
          Constants.frameTime
        );
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
      const transformed = pt.matrixTransform(
        this.svg.getScreenCTM()!.inverse()
      );
      return {
        x: transformed.x + this.viewPort.x,
        y: transformed.y + this.viewPort.y
      };
    },
    handleMouseMove(payload: { x: number; y: number }, transformed = false) {
      const pt = transformed ? payload : this.transformPoint(payload);
      if (!transformed) {
        this.mx = pt.x;
        this.my = pt.y;
      }
      this.stateMachine.execute(Action.MOUSE_MOVE, {
        target: "surface",
        payload: pt,
        event: payload instanceof PointerEvent ? payload : undefined
      });
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
      const defaultDist = Constants.scrollDistance;
      if (this.scrollLeft) {
        const dist = defaultDist;
        this.viewPort.x -= dist;
        this.mx -= dist;
      }
      if (this.scrollTop) {
        const dist = defaultDist;
        this.viewPort.y -= dist;
        this.my -= dist;
      }
      if (this.scrollRight) {
        const dist = defaultDist;
        this.viewPort.x += dist;
        this.mx += dist;
      }
      if (this.scrollBottom) {
        const dist = defaultDist;
        this.viewPort.y += dist;
        this.my += dist;
      }
      this.handleMouseMove({ x: this.mx, y: this.my }, true);
    }
  }
});
</script>
