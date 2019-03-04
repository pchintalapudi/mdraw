<template>
  <button class="root" :title="element.name" :data-group="element.group" @click>
    <p class="atomic-number">{{atomicNumber}}</p>
    <p class="abbrev">{{abbrev}}</p>
    <!-- <p class="mass">{{mass}}</p> -->
    <!-- <p class="name">{{name}}</p> -->
  </button>
</template>
<script lang="ts">
import Vue from "vue";
import { PeriodicTableElement } from "../../models";
export default Vue.extend({
  props: { element: PeriodicTableElement },
  computed: {
    name(): string {
      return this.element.name;
    },
    abbrev(): string {
      return this.element.abbrev;
    },
    mass(): number {
      return Number(this.element.mass.toFixed(3));
    },
    atomicNumber(): number {
      return this.element.atomicNumber;
    }
  },
  methods: {}
});
</script>
<style scoped>
.atomic-number {
  display: inline;
}
.abbrev {
  flex: 1;
  font-size: 125%;
}
.root {
  font-size: 75%;
  display: flex;
  flex-flow: column;
  text-align: center;
  align-items: center;
  min-width: 3.2em;
  max-width: 3.2em;
  min-height: 3.2em;
  max-height: 3.2em;
}
</style>

