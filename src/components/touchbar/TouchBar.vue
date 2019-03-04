<template>
  <aside class="touch-bar">
    <div>
      <button type="button"></button>
      <div>
          <button type="button"></button>
          <button type="button"></button>
      </div>
    </div>
    <button type="button"></button>
  </aside>
</template>
<script lang="ts">
import Vue from "vue";
import PeriodicTableVue from "../periodic_table/PeriodicTable.vue";
import { PeriodicTableElement, elements } from "../../models";
export default Vue.extend({
  components: {
    "periodic-table": PeriodicTableVue
  },
  computed: {
    atomicNumber: {
      get(): number {
        return this.$store.state.molecules.atomicNumber;
      },
      set(atomicNumber: number) {
        this.$store.commit("molecules/setAtomicNumber", atomicNumber);
      }
    },
    element(): PeriodicTableElement {
      return elements[this.atomicNumber - 1];
    }
  }
});
</script>
<style scoped>
</style>
