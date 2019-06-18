<template>
  <span class="touch-bar">
    <atom-creator-vue :state-machine="stateMachine" @button-click="cascade"></atom-creator-vue>
    <lone-pair-creator-vue :state-machine="stateMachine" @button-click="cascade"></lone-pair-creator-vue>
    <arrow-creator-vue :state-machine="stateMachine" @button-click="cascade"></arrow-creator-vue>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import AtomCreatorVue from "./AtomCreator.vue";
import LonePairCreatorVue from "./LonePairCreator.vue";
import ArrowCreatorVue from "./ArrowCreator.vue";
import { StateMachine } from "../../state_machine";
export default Vue.extend({
  props: { stateMachine: StateMachine },
  components: {
    "atom-creator-vue": AtomCreatorVue,
    "lone-pair-creator-vue": LonePairCreatorVue,
    "arrow-creator-vue": ArrowCreatorVue
  },
  methods: {
    cascade(payload: { target: string; payload: any }) {
      this.$emit("button-click", payload);
    }
  }
});
</script>
<style>
.touch-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00000011;
  max-height: 10%;
  opacity: 0.1;
  transition-property: opacity;
  transition: opacity 500ms;
}
.touch-bar>* {
  margin: 5px;
}
.touch-bar:hover {
  opacity: 1;
}
</style>
