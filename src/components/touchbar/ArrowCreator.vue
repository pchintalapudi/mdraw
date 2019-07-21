<template>
  <div class="root">
    <toggle-button @toggle-button="startArrow(false)" :on="onStraight" viewBox="-10 -10 20 20">
      <title>Straight Arrow</title>
      <line x1="-10" y1="0" x2="5" y2="0" style="stroke:black;fill:transparent;"></line>
      <polygon points="5,3.5 5,-3.5 10,0"></polygon>
    </toggle-button>
    <toggle-button @toggle-button="startArrow(true)" viewBox="-10 -10 20 20">
      <title>Curved Arrow</title>
      <path d="M -10,2.5 Q 0,-7.5 10,2.5" style="stroke:black; fill:transparent;"></path>
      <polygon points="5,2 5,-2 10,0" transform="translate(2.5, -4) rotate(40)"></polygon>
    </toggle-button>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import ToggleButtonVue from "./ToggleButton.vue";
import { State, StateMachine, Action } from "../../state_machine";
export default Vue.extend({
  components: { "toggle-button": ToggleButtonVue },
  props: {
    stateMachine: StateMachine
  },
  computed: {
    onStraight(): boolean {
      return (
        this.stateMachine.state === State.PLACING_STRAIGHT_ARROW ||
        this.stateMachine.state === State.ANGLING_STRAIGHT_ARROW
      );
    },
    onCurved(): boolean {
      return (
        this.stateMachine.state === State.PLACING_CURVED_ARROW ||
        this.stateMachine.state === State.DRAWING_CURVED_ARROW
      );
    }
  },
  methods: {
    startArrow(curved: boolean) {
      this.stateMachine.execute(Action.BUTTON, {
        target: curved ? "curved-arrow" : "straight-arrow",
        payload: undefined
      });
    }
  }
});
</script>
<style scoped>
.root {
  display: flex;
  flex-flow: column wrap;
  height: 100%;
}
.root > * {
  height: 50%;
  padding: 5px;
  box-sizing: border-box;
}
</style>
