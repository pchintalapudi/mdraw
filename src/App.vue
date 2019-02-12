<template>
  <router-view/>
</template>
<script lang="ts">
import Vue from "vue";
import Router from "./router";
import Store from "./store";

export default Vue.extend({
  router: Router,
  store: Store
});
</script>
<style lang="scss">
@import "../style/index.scss";
</style>
