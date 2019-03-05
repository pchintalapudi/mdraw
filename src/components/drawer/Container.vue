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
