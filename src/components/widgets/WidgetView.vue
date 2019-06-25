<template>
  <g data-group="widgets">
    <lone-pair-simulator-vue v-if="simulateLonePair" :position="coords" :count="count"></lone-pair-simulator-vue>
    <arrow-simulator-vue v-if="simulateArrow" :position="coords"></arrow-simulator-vue>
    <angler-vue v-if="angling" :offset="offset" :angle="angle" :bond="bond"></angler-vue>
    <selection-rectangle-vue v-if="selecting" :selection-rectangle="selectionBox"></selection-rectangle-vue>
  </g>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import LonePairSimulatorVue from "@/components/widgets/LonePairSimulator.vue";
import ArrowSimulatorVue from "@/components/widgets/ArrowSimulator.vue";
import SelectionRectangleVue from "@/components/widgets/SelectionBox.vue";
import AnglerVue from "@/components/widgets/Angler.vue";
import { State, StateMachine } from "@/state_machine";
import { SelectionRectangle, StraightArrow, RGroup, Bond } from "@/models";
export default Vue.extend({
  components: {
    "arrow-simulator-vue": ArrowSimulatorVue,
    "lone-pair-simulator-vue": LonePairSimulatorVue,
    "selection-rectangle-vue": SelectionRectangleVue,
    "angler-vue": AnglerVue
  },
  props: { stateMachine: Object as PropType<StateMachine> },
  computed: {
    simulateLonePair(): boolean {
      return this.stateMachine.state === State.PLACING_LONE_PAIR;
    },
    count(): number {
      return this.stateMachine.stateVariables.count;
    },
    simulateArrow(): boolean {
      return (
        this.stateMachine.state === State.PLACING_STRAIGHT_ARROW ||
        this.stateMachine.state === State.PLACING_CURVED_ARROW
      );
    },
    coords(): { x: number; y: number } {
      return this.stateMachine.stateVariables.ipos[0];
    },
    selectionBox(): SelectionRectangle {
      return this.stateMachine.stateVariables.selectionBox;
    },
    selected(): Array<RGroup | StraightArrow> {
      return this.stateMachine.stateVariables.selected;
    },
    selecting(): boolean {
      return this.stateMachine.state === State.SELECTING;
    },
    angling(): boolean {
      return this.stateMachine.state === State.PLACING_ATOM_AND_BOND;
    },
    offset(): number {
      return this.stateMachine.stateVariables.lastPlaced;
    },
    angle(): number {
      return this.stateMachine.stateVariables.lastAngle - this.offset;
    },
    bond(): Bond {
      return this.stateMachine.stateVariables.bonds[
        this.stateMachine.stateVariables.bonds.length - 1
      ];
    }
  }
});
</script>
