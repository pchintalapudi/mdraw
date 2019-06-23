<template>
  <span
    class="touch-bar"
    :style="style"
    @mouseenter="mouseEnterEvent"
    @mouseleave="mouseLeaveEvent"
  >
    <atom-creator-vue :state-machine="stateMachine" @button-click="cascade"></atom-creator-vue>
    <lone-pair-creator-vue :state-machine="stateMachine" @button-click="cascade"></lone-pair-creator-vue>
    <arrow-creator-vue :state-machine="stateMachine" @button-click="cascade"></arrow-creator-vue>
  </span>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import AtomCreatorVue from "./AtomCreator.vue";
import LonePairCreatorVue from "./LonePairCreator.vue";
import ArrowCreatorVue from "./ArrowCreator.vue";
import { StateMachine, State } from "../../state_machine";
type StyleProperty = [string, string];
export default Vue.extend({
  props: { stateMachine: Object as PropType<StateMachine> },
  components: {
    "atom-creator-vue": AtomCreatorVue,
    "lone-pair-creator-vue": LonePairCreatorVue,
    "arrow-creator-vue": ArrowCreatorVue
  },
  data() {
    return {
      transparent: false,
      timeoutCode: undefined as number | undefined
    };
  },
  computed: {
    overrideTransparent(): boolean {
      const sv = this.stateMachine.stateVariables;
      return (
        this.stateMachine.state !== State.IDLE ||
        !(sv.rgroups.length || sv.straightArrows.length)
      );
    },
    style(): string {
      const styles: StyleProperty[] = [];
      if (this.transparent && !this.overrideTransparent) {
        styles.push(["opacity", "0.1"]);
      }
      return styles.map(sp => sp.join(":")).join(";");
    }
  },
  methods: {
    cascade(payload: { target: string; payload: any }) {
      this.$emit("button-click", payload);
    },
    mouseEnterEvent() {
      this.transparent = false;
      if (this.timeoutCode !== undefined) window.clearTimeout(this.timeoutCode);
      this.timeoutCode = undefined;
    },
    mouseLeaveEvent() {
      if (this.timeoutCode === undefined) {
        this.timeoutCode = window.setTimeout(() => {
          this.timeoutCode = undefined;
          if ((this.transparent = !this.overrideTransparent)) {
            this.mouseLeaveEvent();
          }
        }, 1500);
      }
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
  max-height: 10%;
  transition-property: opacity;
  transition: opacity 500ms;
}
.touch-bar > * {
  margin: 5px;
}
</style>
