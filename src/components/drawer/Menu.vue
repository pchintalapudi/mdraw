<template>
  <aside>
    <section id="tabs">
      <keep-alive>
        <component :is="widgetType"/>
      </keep-alive>
      <div></div>
    </section>
  </aside>
</template>
<script lang="ts">
import Vue from "vue";
import AngleCalc from "./widgets/AngleCalc.vue";
import AtomCreator from "./widgets/AtomCreator.vue";

enum Tab {
  CREATE_ATOM,
  ANGLE_CALC
}

const tabs = Object.keys(Tab).map(k => Tab[k as any]);

export default Vue.extend({
  components: {
    "angle-calc": AngleCalc,
    "create-atom": AtomCreator
  },
  data: function() {
    return { currentTab: Tab.CREATE_ATOM };
  },
  computed: {
    widgetType() {
      switch (this.currentTab) {
        case Tab.CREATE_ATOM:
          return "create-atom";
        case Tab.ANGLE_CALC:
          return "angle-calc";
        default:
          return "";
      }
    }
  }
});
</script>
