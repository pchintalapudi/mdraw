<template>
  <form name="atom-creator" id="atom-creator">
    <input
      type="number"
      name="atomic-number"
      id="atomic-number"
      @keydown.enter="submit()"
      v-model="atomicNumber"
      min="1"
      :max="max"
    >
    <div
      :data-title="element.name"
      :data-abbrev="element.abbrev"
      :data-atomic-number="atomicNumber + suffix"
    >
      <!--Pseudoelement Target-->
    </div>
    <button type="button" @click="submit()">Create Atom</button>
  </form>
</template>
<script lang="ts">
import Vue from "vue";
import { elements, PeriodicTableElement, RGroup } from "../../../models";
export default Vue.extend({
  data: function() {
    return { max: elements.length + 1 };
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
    },
    suffix() {
      if (this.atomicNumber > 10 && this.atomicNumber < 14) {
        return "th";
      }
      switch (this.atomicNumber % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    }
  },
  methods: {
    submit() {
      this.$store.dispatch("molecules/createAtom");
    }
  }
});
</script>
