<template>
  <form name="lone-group-creator" class="lone-group-creator">
    <toggle-button @toggle-button="spawn(1)" :on="on1" viewBox="-10 -10 20 20">
      <title>Radical Electron</title>
      <circle cx="0" cy="0" r="2.5"></circle>
    </toggle-button>
    <toggle-button @toggle-button="spawn(2)" :on="on2" viewBox="-10 -10 20 20">
      <title>Lone Pair</title>
      <circle cx="-3" cy="-3" r="2.5"></circle>
      <circle cx="3" cy="3" r="2.5"></circle>
    </toggle-button>
  </form>
</template>
<script lang="ts">
import Vue from "vue";
import ToggleButtonVue from "./ToggleButton.vue";
import { State, StateMachine, Action } from "@/state_machine";
export default Vue.extend({
  components: { "toggle-button": ToggleButtonVue },
  props: {
    stateMachine: StateMachine
  },
  computed: {
    on1(): boolean {
      return (
        (this.stateMachine.state === State.PLACING_LONE_PAIR ||
          this.stateMachine.state === State.ANGLING_LONE_PAIR) &&
        this.stateMachine.stateVariables.temp.number === 1
      );
    },
    on2(): boolean {
      return (
        (this.stateMachine.state === State.PLACING_LONE_PAIR ||
          this.stateMachine.state === State.ANGLING_LONE_PAIR) &&
        this.stateMachine.stateVariables.temp.number === 2
      );
    }
  },
  methods: {
    spawn(count: number) {
      this.stateMachine.execute(Action.BUTTON, {
        target: "lone-pair",
        payload: count
      });
    }
  }
});
</script>
<style scoped>
.lone-group-creator {
  display: flex;
  flex-flow: column wrap;
  height: 100%;
}
.lone-group-creator > * {
  height: 50%;
  padding: 5px;
  box-sizing: border-box;
}
</style>
