<template>
  <form name="infer" class="infer">
    <toggle-button @toggle-button="infer" viewBox="-20 -20 40 40">
      <path
        d="M -7.5 2.5 A 10 10 0 1 1 7.5 2.5
         A 5 5 0 0 0 5 7.5 L 5 10
         A 2.5 2.5 0 0 1 2.5 12.5 L -2.5 12.5
         A 2.5 2.5 0 0 1 -5 10 L -5 7.5
         A 5 5 0 0 0 -7.5 2.5"
        stroke="black"
        fill="transparent"
      ></path>
      <line
        stroke-linecap="round"
        fill="transparent"
        stroke="black"
        x1="-3.5"
        x2="3.5"
        y1="14"
        y2="14"
      ></line>
      <line
        stroke-linecap="round"
        fill="transparent"
        stroke="black"
        x1="-2.5"
        x2="2.5"
        y1="15.5"
        y2="15.5"
      ></line>
      <line
        stroke-linecap="round"
        fill="transparent"
        stroke="black"
        x1="-1.5"
        x2="1.5"
        y1="17"
        y2="17"
      ></line>
    </toggle-button>
  </form>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import ToggleButtonVue from "./ToggleButton.vue";
import { infer } from "@/infer/index";
import { StateMachine, Action } from "@/state_machine";
export default Vue.extend({
  components: { "toggle-button": ToggleButtonVue },
  props: { stateMachine: Object as PropType<StateMachine> },
  methods: {
    infer() {
      this.stateMachine.execute(Action.BUTTON, {
        target: "infer",
        payload: undefined
      });
    }
  }
});
</script>
<style scoped>
.infer {
  height: 100%;
}

.infer > * {
  height: 100%;
}
</style>
