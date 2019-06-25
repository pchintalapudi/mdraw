<template>
  <svg
    overflow="auto"
    @pointermove.stop="handleMouseMove"
    @pointerdown.stop="handleMouseDown"
    @pointerup.stop="handleMouseUp"
  >
    <defs>
      <pattern id="patchy" width="5" height="10" patternUnits="userSpaceOnUse">
        <line stroke="black" stroke-width="4px" y2="10"></line>
      </pattern>
      <linearGradient id="d3bond" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="lightgray"></stop>
        <stop offset="50%" stop-color="gray"></stop>
        <stop offset="90%" stop-color="lightgray"></stop>
        <stop offset="100%" stop-color="gray"></stop>
      </linearGradient>
      <pattern id="patchy-d3bond" width="5" height="10" patternUnits="userSpaceOnUse">
        <rect fill="url(#d3bond)" x="0" y="0" width="4" height="10"></rect>
      </pattern>
    </defs>
    <slot></slot>
  </svg>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { StateMachine, Action } from "@/state_machine";
export default Vue.extend({
  props: { stateMachine: Object as PropType<StateMachine> },
  methods: {
    handleMouseMove(payload: PointerEvent) {
      this.stateMachine.execute(Action.MOUSE_MOVE, {
        target: "surface",
        payload
      });
    },
    handleMouseUp(payload: PointerEvent) {
      this.stateMachine.execute(Action.MOUSE_UP, {
        target: "surface",
        payload
      });
    },
    handleMouseDown(payload: PointerEvent) {
      this.stateMachine.execute(Action.MOUSE_DOWN, {
        target: "surface",
        payload
      });
    }
  }
});
</script>
