<template>
  <form name="maps" class="maps">
    <toggle-button :on="mapping" viewBox="-20 -20 40 40" @toggle-button="map">
      <title>MiniMap</title>
      <svg height="40" width="40" x="-20" y="-20" :viewBox="viewPort.serialized">
        <use href="#molecules" />
      </svg>
      <use href="#pan-arrow" transform="translate(0, -10)" />
      <use href="#pan-arrow" transform="translate(10, 0) rotate(90, 0, 0)"></use>
      <use href="#pan-arrow" transform="translate(0, 10) rotate(180, 0, 0)"></use>
      <use href="#pan-arrow" transform="translate(-10, 0) rotate(-90, 0, 0)"></use>
    </toggle-button>
    <div class="buttons">
      <toggle-button @toggle-button="goHome" :on="false" viewBox="-10 -10 20 20">
        <title>Go Home</title>
        <path
          d="M -6.25 0 L 0 -6.25 L 6.25 0 L 4.25 0 L 4.25 6.25 L 1.25 6.25 L 1.25 1.25 L -1.25 1.25 L -1.25 6.25 L -4.25 6.25 L -4.25 0 Z"
          fill="transparent"
          stroke="black"
          stroke-width="0.75"
        ></path>
      </toggle-button>
      <toggle-button :on="panning" @toggle-button="pan" viewBox="-10 -10 20 20">
        <title>{{panning ? 'Stop' : 'Start'}} Panning</title>
        <path
          id="pan-arrow"
          d="M -1.25 -2.5 L -1.25 -5 L -2.5 -5 L 0 -7.5 L 2.5 -5 L 1.25 -5 L 1.25 -2.5 Z"
          fill="transparent"
          stroke="black"
          stroke-width="0.75"
        ></path>
        <use href="#pan-arrow" transform="rotate(90, 0, 0)"></use>
        <use href="#pan-arrow" transform="rotate(180, 0, 0)"></use>
        <use href="#pan-arrow" transform="rotate(-90, 0, 0)"></use>
      </toggle-button>
    </div>
  </form>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import ToggleButtonVue from "./ToggleButton.vue";
import { State, StateMachine, Action } from "@/state_machine";
import { Rectangle } from "@/utils";
export default Vue.extend({
  components: { "toggle-button": ToggleButtonVue },
  props: { stateMachine: Object as PropType<StateMachine> },
  computed: {
    mapping(): boolean {
      return this.stateMachine.state === State.MAPPING;
    },
    panning(): boolean {
      return this.stateMachine.state === State.PANNING;
    },
    viewPort(): Rectangle {
      return this.stateMachine.view.viewPort;
    }
  },
  methods: {
    goHome() {
      this.viewPort.x = 0;
      this.viewPort.y = 0;
    },
    map() {
      this.stateMachine.execute(Action.BUTTON, {
        target: "mapping",
        payload: undefined
      });
    },
    pan() {
      this.stateMachine.execute(Action.BUTTON, {
        target: "panning",
        payload: undefined
      });
    }
  }
});
</script>
<style scoped>
.maps {
  height: 100%;
  display: flex;
  flex-flow: row wrap;
}
.maps > * {
  height: 100%;
}
.buttons {
  display: flex;
  flex-flow: column wrap;
}
.buttons > * {
  height: 50%;
}
</style>
