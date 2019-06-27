<template>
  <form name="maps" class="maps">
    <toggle-button :on="mapping" viewBox="-10 -10 20 20">
      <title>MiniMap</title>
    </toggle-button>
    <div class="buttons">
      <toggle-button @toggle-button="goHome" :on="false" viewBox="-10 -10 20 20">
        <title>Go Home</title>
      </toggle-button>
      <toggle-button :on="panning" viewBox="-10 -10 20 20">
        <title>{{panning ? 'Start' : 'Stop'}} Panning</title>
      </toggle-button>
    </div>
  </form>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import ToggleButtonVue from "./ToggleButton.vue";
import { State, StateMachine } from "@/state_machine";
export default Vue.extend({
  components: { "toggle-button": ToggleButtonVue },
  props: { stateMachine: Object as PropType<StateMachine> },
  computed: {
    mapping(): boolean {
      return this.stateMachine.state === State.MAPPING;
    },
    panning(): boolean {
      return this.stateMachine.state === State.PANNING;
    }
  },
  methods: {
    goHome() {
      this.stateMachine.viewbox.viewX = 0;
      this.stateMachine.viewbox.viewY = 0;
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
