<template>
  <main>
    <surface-area></surface-area>
    <aside-menu></aside-menu>
  </main>
</template>
<script lang="ts">
import Vue from "vue";
import Menu from "./Menu.vue";
import Surface from "./Surface.vue";
export default Vue.extend({
  components: { "aside-menu": Menu, "surface-area": Surface }
});
</script>
