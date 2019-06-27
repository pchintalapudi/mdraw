<template>
  <div class="wrapper">
    <svg-vue :class="classes" :state-machine="stateMachine">
      <molecule-vue :state-machine="stateMachine" :omit="omit" :d3="d3" id="molecules"></molecule-vue>
      <widget-vue :state-machine="stateMachine"></widget-vue>
    </svg-vue>
    <touchbar-vue class="touch-bar" :state-machine="stateMachine"></touchbar-vue>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { StateMachine, Action, State, init_transforms } from "../state_machine";
import { element } from "../models";
import MoleculeVue from "@/components/molecules/MoleculeView.vue";
import WidgetVue from "@/components/widgets/WidgetView.vue";
import TouchBarVue from "@/components/touchbar/TouchBar.vue";
import SVGVue from "@/components/SVGVue.vue";
import { data, keyHandler } from "./utils";
export default Vue.extend({
  components: {
    "svg-vue": SVGVue,
    "molecule-vue": MoleculeVue,
    "widget-vue": WidgetVue,
    "touchbar-vue": TouchBarVue
  },
  data,
  mounted() {
    init_transforms();
    window.addEventListener(
      "keydown",
      (this.keyHandler = (ev: KeyboardEvent) =>
        keyHandler(this.$data as ReturnType<typeof data>, ev))
    );
    window.addEventListener("resize", this.stateMachine.viewbox.listener);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keyHandler);
    window.removeEventListener("resize", this.stateMachine.viewbox.listener);
  },
  computed: {
    //For debugging
    stateName(): string {
      return State[this.stateMachine.state];
    },
    classes(): string[] {
      const clazzes = ["surface"];
      if (this.omit) {
        clazzes.push("omit");
      }
      return clazzes;
    }
  }
});
</script>
<style>
.touch-bar {
  position: fixed;
  max-height: 200px;
  height: 10vh;
  min-height: 2em;
  bottom: 5%;
  left: 100px;
  right: 100px;
  margin: auto;
}
.surface {
  height: 100%;
  width: 100%;
}
.wrapper {
  height: 100%;
  width: 100%;
  display: flex;
}
.omit .omittable {
  visibility: hidden;
  pointer-events: none;
}
html,
body {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
