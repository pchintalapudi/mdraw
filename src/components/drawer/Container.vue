<template>
  <main>
    <surface-area></surface-area>
    <transition name="fade">
      <dialog-wrapper v-if="dialogOpen"></dialog-wrapper>
    </transition>
    <touch-bar></touch-bar>
  </main>
</template>
<script lang="ts">
import Vue from "vue";
import Surface from "./Surface.vue";
import DialogWrapperVue from "./files/DialogWrapper.vue";
import TouchBarVue from "../touchbar/TouchBar.vue";
export default Vue.extend({
  components: {
    "surface-area": Surface,
    "dialog-wrapper": DialogWrapperVue,
    "touch-bar": TouchBarVue
  },
  computed: {
    dialogOpen(): boolean {
      return this.$store.state.files.open;
    }
  }
});
</script>
<style>
:root {
  /* --primary-bg: white;
    --contrast-bg: black;
    --primary-focus: #0088ff;
    --contrast-focus: #ff2222; */
  --primary-bg-red: 255;
  --primary-bg-green: 255;
  --primary-bg-blue: 255;

  --contrast-bg-red: 0;
  --contrast-bg-green: 0;
  --contrast-bg-blue: 0;

  --primary-focus-red: 0;
  --primary-focus-green: 127;
  --primary-focus-blue: 255;

  --contrast-focus-red: 255;
  --contrast-focus-green: 32;
  --contrast-focus-blue: 32;
}
</style>
