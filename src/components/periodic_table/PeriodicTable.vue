<template>
  <article class="periodic-table">
    <section v-for="(period, index) of mainTable" :key="index + ' period'" class="period">
      <component
        v-for="el of period"
        :key="el ? el.atomicNumber : 0"
        :is="el ? 'element-button' : 'empty-box'"
        :element="el"
      ></component>
    </section>
    <div style="height: 1em"></div>
    <section v-for="(period, index) of fblock" :key="index + 'f'" class="period">
      <empty-box></empty-box>
      <empty-box></empty-box>
      <element-button v-for="el of period" :key="el.atomicNumber" :element="el"></element-button>
    </section>
  </article>
</template>
<script lang="ts">
import Vue from "vue";
import EmptyElementVue from "./EmptyElement.vue";
import ElementVue from "./Element.vue";
import { elements, PeriodicTableElement } from "../../models";
export default Vue.extend({
  components: {
    "empty-box": EmptyElementVue,
    "element-button": ElementVue
  },
  data: function() {
    return { elements };
  },
  computed: {
    mainTable(): PeriodicTableElement[][] {
      return [
        this.leftPad(this.elements.slice(0, 2)),
        this.leftPad(this.elements.slice(2, 10)),
        this.leftPad(this.elements.slice(10, 18)),
        this.elements.slice(18, 36),
        this.elements.slice(36, 54),
        [...this.elements.slice(54, 57), ...this.elements.slice(71, 86)],
        [...this.elements.slice(86, 89), ...this.elements.slice(103)]
      ];
    },
    fblock(): PeriodicTableElement[][] {
      return [this.elements.slice(57, 71), this.elements.slice(89, 103)];
    }
  },
  methods: {
    //Yes i named it this
    leftPad(pad: PeriodicTableElement[]) {
      let ret = [];
      while (pad.length) {
        let el = pad.shift()!;
        let length = el.group - ret.length - 1;
        console.log(el.name);
        console.log(length);
        ret.push(...Array(el.group - ret.length - 1).fill(undefined));
        ret.push(el);
      }
      console.log(ret);
      return ret;
    }
  }
});
</script>
<style scoped>
.periodic-table {
  display: flex;
  flex-flow: column nowrap;
}
.period {
  display: flex;
  flex-flow: row nowrap;
}
</style>

