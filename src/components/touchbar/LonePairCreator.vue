<template>
  <form name="lone-group-creator" :class="classes">
    <button @click="spawn(1)" type="button">
      <svg viewBox="-10 -10 20 20">
        <circle cx="0" cy="0" r="2.5"></circle>
      </svg>
    </button>
    <button @click="spawn(2)" type="button">
      <svg viewBox="-10 -10 20 20">
        <circle cx="-3" cy="-3" r="2.5"></circle>
        <circle cx="3" cy="3" r="2.5"></circle>
      </svg>
    </button>
  </form>
</template>
<script lang="ts">
import Vue from "vue";
import { State, StateMachine } from "../../state_machine";
export default Vue.extend({
  props: {
    stateMachine: StateMachine
  },
  data() {
    return { count: 2 };
  },
  computed: {
    classes(): string[] {
      const clazzes = ["lone-group-creator"];
      if (this.stateMachine.state === State.PLACING_LONE_PAIR) {
        clazzes.push("placing-" + this.count);
      }
      return clazzes;
    }
  },
  methods: {
    spawn(count: number) {
      this.count = count;
      this.$emit("button-click", { target: "lone-pair", payload: count });
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
.lone-group-creator > button {
  height: 50%;
}
.lone-group-creator svg {
  height: 100%;
}
.placing-1>:nth-child(1) {
  background-color: #0088ff44;
}
.placing-2>:nth-child(2) {
  background-color: #0088ff44;
}
</style>
