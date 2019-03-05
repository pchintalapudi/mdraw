<template>
  <aside class="touch-bar">
    <button type="button" @click="createAtom">
      <div class="circle">C</div>
    </button>
    <div class="col">
      <button type="button">Summon Periodic Table</button>
      <button type="button"></button>
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
  },
  methods: {
    createAtom() {
      this.$store.dispatch("molecules/createAtom");
    }
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
</style>
