<template>
  <span class="root">
    <button type="button" @click="createAtom">
      <div class="circle">{{element.abbrev}}</div>
    </button>
    <div class="col">
      <button type="button" class="pt-button">
        <div class="pt-icon-before"></div>
        <div class="pt-icon"></div>
        <div class="pt-icon-after"></div>
      </button>
      <input
        type="number"
        name="atomic-number-input"
        id="atomic-number-input"
        v-show="editingAtomicNumber"
        @input="updateAtomicNumber"
        @blur="finishEdit"
        v-model="raw"
        :class="valid ? '' : 'invalid'"
        min="1"
        max="118"
        step="1"
      >
      <p v-show="!editingAtomicNumber" @click.stop="startEdit" class="pt-num">{{atomicNumber}}</p>
    </div>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import PeriodicTableVue from "../periodic_table/PeriodicTable.vue";
import { PeriodicTableElement, elements } from "../../models";
export default Vue.extend({
  components: {
    "periodic-table": PeriodicTableVue
  },
  data() {
    return {
      editingAtomicNumber: false,
      raw: "6",
      last: 6,
      valid: true,
      inp: undefined as HTMLInputElement | undefined
    };
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
  mounted() {
    this.inp = document.getElementById(
      "atomic-number-input"
    ) as HTMLInputElement;
  },
  methods: {
    createAtom() {
      this.$store.dispatch("molecules/createAtom");
    },
    startEdit() {
      this.editingAtomicNumber = true;
      this.last = this.atomicNumber;
      this.raw = this.last.toString();
      this.valid = true;
      this.inp!.focus();
    },
    updateAtomicNumber() {
      try {
        let num = Number(this.raw);
        if (num > 0 && num < 199) {
          this.atomicNumber = num;
          this.valid = true;
          return;
        }
      } catch {}
      if (this.raw) {
        this.valid = false;
      }
    },
    finishEdit() {
      if (!this.valid && (this.valid = true)) this.atomicNumber = this.last;
      this.editingAtomicNumber = false;
    }
  }
});
</script>
<style scoped>
.root {
  display: flex;
}
</style>
