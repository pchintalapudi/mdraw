<template>
  <div class="root">
    <button @click="startArrow(false)">
      <svg viewBox="-10 -10 20 20">
        <line x1="-10" y1="0" x2="5" y2="0" style="stroke:black;fill:transparent;"></line>
        <polygon points="5,3.5 5,-3.5 10,0"></polygon>
      </svg>
    </button>
    <button @click="startArrow(true)">
      <svg viewBox="-10 -10 20 20">
        <path d="M -10,2.5 Q 0,-7.5 10,2.5" style="stroke:black; fill:transparent;"></path>
        <polygon points="5,2 5,-2 10,0" transform="translate(2.5, -4) rotate(40)"></polygon>
      </svg>
    </button>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { State, StateMachine } from "../../state_machine";
export default Vue.extend({
  props: {
    state: StateMachine
  },
  methods: {
    startArrow(curved: boolean) {
      this.$emit("button-click", {
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
.root > button {
  height: 50%;
}
.root svg {
  height: 100%;
}
</style>
