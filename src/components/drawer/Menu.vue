<template>
  <aside>
    <section></section>
    <minimap></minimap>
  </aside>
</template>
<script lang="ts">
import Vue from "vue";
import Minimap from "./widgets/Minimap.vue";
export default Vue.extend({
  components: { minimap: Minimap }
});
</script>
