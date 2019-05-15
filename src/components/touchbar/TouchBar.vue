<template>
  <span class="touch-bar">
    <atom-creator-vue @button-click="cascade"></atom-creator-vue>
    <lone-pair-creator-vue @button-click="cascade"></lone-pair-creator-vue>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import AtomCreatorVue from "./AtomCreator.vue";
import LonePairCreatorVue from "./LonePairCreator.vue";
export default Vue.extend({
  components: {
    "atom-creator-vue": AtomCreatorVue,
    "lone-pair-creator-vue": LonePairCreatorVue
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
}
</style>
