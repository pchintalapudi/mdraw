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
      this.$nextTick(() => this.inp!.focus());
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
[type="button"] {
    padding: 0;
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
.invalid {
  border-style: solid;
  border-color: var(--contrast-focus-active);
}
#atomic-number-input,
.pt-button,
.pt-num {
  min-width: 3em;
  max-width: 3em;
  flex: 1;
  margin: 0;
  border-style: none;
}
.pt-num {
    text-align: center;
}
.pt-button {
  display: flex;
  align-items: flex-end;
}
.pt-icon,
.pt-icon-before,
.pt-icon-after {
  display: inline-block;
  height: 1.5em;
  background-color: var(--contrast-bg-light);
}
.pt-icon {
  height: 1em;
  width: 1.5em;
}
.pt-icon-before {
  width: 0.5em;
}
.pt-icon-after {
  width: 1em;
}
</style>
