<template>
  <article>
    <section></section>
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
  computed: {
    mainTable() {
      return [
        elements.slice(0, 2).reverse(),
        elements.slice(2, 10).reverse(),
        elements.slice(10, 18).reverse()
      ];
    }
  },
  methods: {
    //Yes i named it this
    leftPad(pad: PeriodicTableElement[]) {
      let ret = [];
      while (pad.length) {
        let el = pad.pop()!;
        ret.push(...Array(el.group - ret.length - 1).fill(undefined));
        ret.push(el);
      }
      return ret;
    }
  }
});
</script>
