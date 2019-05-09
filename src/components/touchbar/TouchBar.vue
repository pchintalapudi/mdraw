<template>
  <span class="touch-bar">
    <form name="atom-creator">
      <button type="button" @click="spawn" :title="element.name">
        <div style="border-radius:50%;border-color:black;border-style:solid;padding:0 0.25em;">{{element.abbrev}}</div>
      </button>
      <select name="atom-selector" id="atom-selector" v-model="element">
        <optgroup label="Recently Used">
          <option
            v-for="el in recentlyUsed"
            :key="el.number"
            :value="el"
          >{{`${el.number} ${el.name} (${el.abbrev})`}}</option>
        </optgroup>
        <optgroup label="Other Elements">
          <option
            v-for="el in choices"
            :key="el.number"
            :value="el"
          >{{`${el.number} ${el.name} (${el.abbrev})`}}</option>
        </optgroup>
      </select>
    </form>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import { ChemicalElement, elementCount, element } from "../../models";
const elements: ChemicalElement[] = [];
for (let i = 1; i <= elementCount; i++) {
  elements.push(element(i));
}
export default Vue.extend({
  data() {
    return { recentlyUsed: [elements[5]], element: elements[5] };
  },
  computed: {
    choices(): ChemicalElement[] {
      return elements.filter(el => !this.recentlyUsed.includes(el));
    }
  },
  watch: {
    element(next) {
      this.$nextTick(this.spawn);
    }
  },
  methods: {
    spawn() {
      if (!this.recentlyUsed.includes(this.element)) {
        this.recentlyUsed.push(this.element);
        if (this.recentlyUsed.length > 6) {
          this.recentlyUsed.splice(0, 1);
        }
      }
      this.$emit("button-click", {
        target: "spawn",
        payload: this.element
      });
    }
  }
});
</script>
<style>
.touch-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00000011;
}
</style>
