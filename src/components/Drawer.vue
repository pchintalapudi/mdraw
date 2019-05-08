<template>
  <div class="wrapper">
    <svg
      overflow="auto"
      @pointermove.stop="handleMouseMove"
      @pointerdown.stop="handleMouseDown"
      @pointerup.stop="handleMouseUp"
      @keypress.stop="handleKey"
      class="surface"
    >
      <defs>
        <pattern id="patchy" width="5" height="10" patternUnits="userSpaceOnUse">
          <line stroke="black" stroke-width="4px" y2="10"></line>
        </pattern>
      </defs>
      <bond-vue
        v-for="bond in bonds"
        :key="bond.id"
        :bond="bond"
        :transparent="transparent.includes(bond)"
      ></bond-vue>
      <rgroup-vue
        v-for="rgroup in rgroups"
        :key="rgroup.id"
        :rgroup="rgroup"
        @dmouse="handleMouseDownRGroup"
        @mmouse="handleMouseMoveRGroup"
        @umouse="handleMouseUpRGroup"
        :transparent="transparent.includes(rgroup)"
      ></rgroup-vue>
      <angler-vue :offset="offset" :angle="angle" :bond="bond" v-if="angling"></angler-vue>
      <selection-rectangle-vue v-if="selecting" :selection-rectangle="selectionBox"></selection-rectangle-vue>
    </svg>
    <touchbar-vue class="touch-bar" @button-click="handleButtonClick"></touchbar-vue>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { StateMachine, Action, init_transforms, State } from "../state_machine";
import { RGroup, Bond, ChemicalElement, SelectionRectangle } from "../models";
import RGroupVue from "@/components/molecules/RGroup.vue";
import BondVue from "@/components/molecules/Bond.vue";
import TouchBarVue from "@/components/touchbar/TouchBar.vue";
import SelectionRectangleVue from "@/components/widgets/SelectionBox.vue";
import AnglerVue from "@/components/widgets/Angler.vue";
export default Vue.extend({
  components: {
    "bond-vue": BondVue,
    "rgroup-vue": RGroupVue,
    "touchbar-vue": TouchBarVue,
    "selection-rectangle-vue": SelectionRectangleVue,
    "angler-vue": AnglerVue
  },
  data() {
    return {
      stateMachine: new StateMachine()
    };
  },
  mounted: init_transforms,
  computed: {
    rgroups(): RGroup[] {
      return this.stateMachine.stateVariables.rgroups;
    },
    bonds(): Bond[] {
      return this.stateMachine.stateVariables.bonds;
    },
    selectionBox(): SelectionRectangle {
      return this.stateMachine.stateVariables.selectionBox;
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
      return this.bonds[this.bonds.length - 1];
    },
    transparent(): Array<RGroup | Bond> {
      const transp = [];
      if (
        this.stateMachine.state === State.PLACING_ATOM ||
        this.stateMachine.state === State.PLACING_ATOM_AND_BOND
      ) {
        transp.push(this.stateMachine.stateVariables.creating);
        transp.push(...this.stateMachine.stateVariables.bonds);
      }
      return transp;
    }
  },
  methods: {
    handleButtonClick(payload: { target: string; payload: ChemicalElement }) {
      this.stateMachine.execute(Action.BUTTON, payload);
    },
    handleMouseMove(payload: PointerEvent) {
      this.stateMachine.execute(Action.MOUSE_MOVE, {
        target: "surface",
        payload
      });
    },
    handleMouseUp(payload: PointerEvent) {
      this.stateMachine.execute(Action.MOUSE_UP, {
        target: "surface",
        payload
      });
    },
    handleMouseDown(payload: PointerEvent) {
      this.stateMachine.execute(Action.MOUSE_DOWN, {
        target: "surface",
        payload
      });
    },
    handleMouseDownRGroup(payload: { target: string; payload: RGroup }) {
      this.stateMachine.execute(Action.MOUSE_DOWN, payload);
    },
    handleMouseUpRGroup(payload: { target: string; payload: RGroup }) {
      this.stateMachine.execute(Action.MOUSE_UP, payload);
    },
    handleMouseMoveRGroup(payload: { target: string; payload: RGroup }) {
      this.stateMachine.execute(Action.MOUSE_MOVE, payload);
    },
    handleKey(event: KeyboardEvent) {
      //
    }
  }
});
</script>
<style scoped>
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
</style>