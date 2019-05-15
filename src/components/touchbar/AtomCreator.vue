<template>
  <form name="atom-creator" class="atom-creator">
    <button type="button" @click="spawn" :title="element.name">
      <svg viewBox="-5 -5 10 10" overflow="visible">
        <circle cx="0" cy="0" r="6" fill="transparent" stroke="black" stroke-width="0.5"></circle>
        <text text-anchor="middle" dominant-baseline="central" font-size="0.5em">{{element.abbrev}}</text>
      </svg>
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
<style scoped>
.atom-creator {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
}
.atom-creator > button {
  height: 50%;
  width: 25%;
  align-self: center;
}
.atom-creator svg {
  height: calc(100% - 6px);
}
</style>
