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
<style>
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
[type="button"] {
  padding: 10px;
  background-color: transparent;
  transition: background-color 200ms;
  border: var(--primary-focus);
}
[type="button"]:hover {
  background-color: var(--primary-focus-hov);
}
[type="button"]:active {
  background-color: var(--primary-focus-active);
}
.circle {
  border-radius: 50%;
  height: 2em;
  width: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: solid;
}
.invalid {
  border-style: solid;
  border-color: var(--contrast-focus-active);
}
#atomic-number-input,
.pt-button,
.pt-num {
  min-width: 3em;
  max-width: 3em;
  flex: 1;
  margin: 0;
  border-style: none;
}
.pt-button {
  display: flex;
  align-items: flex-end;
}
.pt-icon,
.pt-icon-before,
.pt-icon-after {
  display: inline-block;
  height: 1.5em;
  background-color: var(--contrast-bg-light);
}
.pt-icon {
  height: 1em;
  width: 1.5em;
}
.pt-icon-before {
  width: 0.5em;
}
.pt-icon-after {
  width: 1em;
}
</style>
