<template>
  <button :title="element.name">
    <p>
      <sup>{{atomicNumber}}</sup>
      {{abbrev}}
    </p>
    <p>{{mass}}</p>
    <p>{{name}}</p>
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
      return this.element.mass;
    },
    atomicNumber(): number {
      return this.element.atomicNumber;
    }
  }
});
</script>
<style scoped>
sup {
  display: inline;
}
</style>

