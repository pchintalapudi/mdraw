<template>
  <aside class="touch-bar" @click.stop.prevent>
    <atom-creator/>
    <button type="button"></button>
  </aside>
</template>
<script lang="ts">
import Vue from "vue";
import AtomCreatorVue from "./AtomCreator.vue";
export default Vue.extend({
  components: {
    "atom-creator": AtomCreatorVue
  }
});
</script>
<style scoped>
.touch-bar {
  position: fixed;
  z-index: 1;
  left: 12.5vw;
  right: 12.5vw;
  bottom: 12.5vh;
  top: 75vh;
  background-color: var(--contrast-bg-light);
  justify-content: center;
  align-items: center;
  display: flex;
}
.col {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}
</style>
