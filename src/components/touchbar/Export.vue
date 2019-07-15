<template>
  <div class="export">
    <toggle-button :on="!!showing" @toggle-button="showing = !showing" viewBox="-20 -20 40 40">
      <rect
        x="-15"
        y="-7.5"
        width="15"
        height="15"
        rx="5"
        ry="5"
        stroke="black"
        fill="transparent"
        stroke-width="1"
      ></rect>
      <path d="M -6.25 -.625 L 2.5 -.625 L 2.5 -2.5 L 7.5 0 L 2.5 2.5 L 2.5 .625 L -6.25 .625 Z"></path>
      <circle r="1" cx="10"></circle>
      <circle r="1" cx="12.5"></circle>
      <circle r="1" cx="15"></circle>
    </toggle-button>
    <div v-if="showing" tabindex="0" class="types">
      <a
        v-for="name in ['svg', 'png', 'jpeg']"
        :key="name"
        tabindex="0"
        class="button clear-link"
        :download="`mdraw.${name}`"
        :href="fileData(name)"
        target="_blank"
        @click="showing=0"
      >{{name}}</a>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import ToggleButtonVue from "./ToggleButton.vue";
import { StateMachine, Action } from "@/state_machine";
import { exp } from "../../export";
export default Vue.extend({
  props: { stateMachine: StateMachine },
  components: { "toggle-button": ToggleButtonVue },
  data() {
    return { showing: 0 };
  },
  methods: {
    blur() {
      this.showing = Math.max(0, this.showing - 1);
    },
    focus() {
      this.showing++;
    },
    fileData(name: "svg" | "png" | "jpeg"): string | null {
      return exp(this.stateMachine, name);
    }
  }
});
</script>
<style scoped>
.export {
  height: 100%;
  position: relative;
}
.export > :first-child {
  height: 100%;
}
.types {
  position: absolute;
  bottom: 110%;
  left: 0;
  background-color: #00000011;
  border: 2px solid #00000044;
  border-radius: 5px;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  width: 100%;
}
.types > * {
  height: 2em;
}
.clear-link:any-link {
  text-decoration: none;
  color: black;
}
</style>
