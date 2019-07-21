<template>
  <g data-group="widgets">
    <lone-pair-simulator-vue
      v-if="simulateLonePair"
      :position="coords"
      :count="stateMachine.stateVariables.count"
    ></lone-pair-simulator-vue>
    <arrow-simulator-vue v-if="simulateArrow" :position="coords"></arrow-simulator-vue>
    <angler-vue v-if="angling" :offset="offset" :angle="angle" :bond="bond"></angler-vue>
    <rect
      v-if="selecting"
      :x="selectionBox.left"
      :y="selectionBox.top"
      :width="selectionBox.right - selectionBox.left"
      :height="selectionBox.bottom - selectionBox.top"
      fill="#0088ff44"
      stroke="#0088ff88"
    ></rect>
  </g>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import LonePairSimulatorVue from "@/components/widgets/LonePairSimulator.vue";
import ArrowSimulatorVue from "@/components/widgets/ArrowSimulator.vue";
import AnglerVue from "@/components/widgets/Angler.vue";
import { State, StateMachine } from "@/state_machine";
import { StraightArrow, RGroup, Bond } from "@/models";
import { Rectangle } from "@/utils";
export default Vue.extend({
  components: {
    "arrow-simulator-vue": ArrowSimulatorVue,
    "lone-pair-simulator-vue": LonePairSimulatorVue,
    "angler-vue": AnglerVue
  },
  props: { stateMachine: Object as PropType<StateMachine> },
  computed: {
    simulateLonePair(): boolean {
      return (
        this.stateMachine.state === State.PLACING_LONE_PAIR &&
        !this.stateMachine.stateVariables.temp.number
      );
    },
    simulateArrow(): boolean {
      return (
        this.stateMachine.state === State.PLACING_STRAIGHT_ARROW ||
        this.stateMachine.state === State.PLACING_CURVED_ARROW
      );
    },
    coords(): { x: number; y: number } {
      return this.stateMachine.stateVariables.temp.point;
    },
    selectionBox(): Rectangle {
      return this.stateMachine.stateVariables.selection.selectionBox;
    },
    selecting(): boolean {
      return this.stateMachine.state === State.SELECTING;
    },
    angling(): boolean {
      return this.stateMachine.state === State.PLACING_ATOM_AND_BOND;
    },
    offset(): number {
      return this.stateMachine.stateVariables.cache.lastPlaced;
    },
    angle(): number {
      return this.stateMachine.stateVariables.cache.lastAngle - this.offset;
    },
    bond(): Bond {
      return this.stateMachine.stateVariables.bonds[
        this.stateMachine.stateVariables.bonds.length - 1
      ];
    }
  }
});
</script>
