<template>
  <main>
    <article></article>
    <aside-menu></aside-menu>
  </main>
</template>
<script lang="ts">
import Vue from "vue";
import Menu from "./Menu.vue";
export default Vue.extend({
  components: { "aside-menu": Menu }
});
</script>
