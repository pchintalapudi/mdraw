<template>
  <aside>
    <section>
        <angle-calc></angle-calc>
    </section>
    <minimap></minimap>
  </aside>
</template>
<script lang="ts">
import Vue from "vue";
import Minimap from "./widgets/Minimap.vue";
import AngleCalc from "./widgets/AngleCalc.vue";
export default Vue.extend({
  components: { minimap: Minimap, "angle-calc": AngleCalc }
});
</script>
