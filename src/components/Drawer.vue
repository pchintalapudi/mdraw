<template>
  <div class="wrapper">
    <svg
      overflow="auto"
      @pointermove.stop="handleMouseMove"
      @pointerdown.stop="handleMouseDown"
      @pointerup.stop="handleMouseUp"
      :class="classes"
    >
      <defs>
        <pattern id="patchy" width="5" height="10" patternUnits="userSpaceOnUse">
          <line stroke="black" stroke-width="4px" y2="10"></line>
        </pattern>
      </defs>
      <straight-arrow-vue
        v-for="arrow in straightArrows"
        :key="arrow.id"
        :arrow="arrow"
        :selected="selected.includes(arrow)"
      ></straight-arrow-vue>
      <bond-vue
        v-for="bond in bonds"
        :key="bond.id"
        :bond="bond"
        :transparent="transparent.includes(bond)"
        @click-bond="handleBondClick"
        @dblclick-bond="handleBondDblClick"
        @dmouse="handleMouseDownBond"
        @mmouse="handleMouseMoveBond"
        @umouse="handleMouseUpBond"
        :omitting="omit"
      ></bond-vue>
      <rgroup-vue
        v-for="rgroup in rgroups"
        :key="rgroup.id"
        :rgroup="rgroup"
        @dmouse="handleMouseDownRGroup"
        @mmouse="handleMouseMoveRGroup"
        @umouse="handleMouseUpRGroup"
        :transparent="transparent.includes(rgroup)"
        :selected="selected.includes(rgroup)"
        :omitting="omit"
      ></rgroup-vue>
      <curved-arrow-vue v-for="arrow in curvedArrows" :key="arrow.id" :arrow="arrow"></curved-arrow-vue>
      <lone-pair-simulator-vue v-if="simulateLonePair" :position="ipos0" :count="count"></lone-pair-simulator-vue>
      <arrow-simulator-vue v-if="simulateArrow" :stubby="stubby" :position="ipos0"></arrow-simulator-vue>
      <angler-vue :offset="offset" :angle="angle" :bond="bond" v-if="angling"></angler-vue>
      <selection-rectangle-vue v-if="selecting" :selection-rectangle="selectionBox"></selection-rectangle-vue>
    </svg>
    <touchbar-vue class="touch-bar" @button-click="handleButtonClick"></touchbar-vue>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { StateMachine, Action, State, init_transforms } from "../state_machine";
import {
  RGroup,
  Bond,
  ChemicalElement,
  SelectionRectangle,
  element,
  StraightArrow,
  CurvedArrow
} from "../models";
import { saveFile, loadFile } from "../files";
import RGroupVue from "@/components/molecules/RGroup.vue";
import BondVue from "@/components/molecules/Bond.vue";
import LonePairSimulatorVue from "@/components/molecules/LonePairSimulator.vue";
import ArrowSimulatorVue from "@/components/molecules/ArrowSimulator.vue";
import StraightArrowVue from "@/components/molecules/StraightArrow.vue";
import CurvedArrowVue from "@/components/molecules/CurvedArrow.vue";
import TouchBarVue from "@/components/touchbar/TouchBar.vue";
import SelectionRectangleVue from "@/components/widgets/SelectionBox.vue";
import AnglerVue from "@/components/widgets/Angler.vue";
export default Vue.extend({
  components: {
    "bond-vue": BondVue,
    "rgroup-vue": RGroupVue,
    "straight-arrow-vue": StraightArrowVue,
    "curved-arrow-vue": CurvedArrowVue,
    "arrow-simulator-vue": ArrowSimulatorVue,
    "lone-pair-simulator-vue": LonePairSimulatorVue,
    "touchbar-vue": TouchBarVue,
    "selection-rectangle-vue": SelectionRectangleVue,
    "angler-vue": AnglerVue
  },
  data() {
    return {
      stateMachine: new StateMachine(),
      clipboard: "",
      omit: false,
      dialogging: false,
      saving: "",
      loading: false,
      deserializeOnSave: false,
      lastElement: element(6)
    };
  },
  mounted() {
    init_transforms();
    window.addEventListener("keydown", this.handleKey);
    // window.addEventListener("beforeunload", ev => {
    //   if (!this.stateMachine.saved) {
    //     ev.preventDefault();
    //     return "Don't close yet";
    //   }
    // });
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKey);
  },
  computed: {
    rgroups(): RGroup[] {
      return this.stateMachine.stateVariables.rgroups;
    },
    bonds(): Bond[] {
      return this.stateMachine.stateVariables.bonds;
    },
    straightArrows(): StraightArrow[] {
      return this.stateMachine.stateVariables.straightArrows;
    },
    curvedArrows(): CurvedArrow[] {
      return this.stateMachine.stateVariables.curvedArrows;
    },
    selectionBox(): SelectionRectangle {
      return this.stateMachine.stateVariables.selectionBox;
    },
    selecting(): boolean {
      return this.stateMachine.state === State.SELECTING;
    },
    selected(): Array<{ x: number; y: number; id: number }> {
      return this.stateMachine.stateVariables.selected;
    },
    state(): string {
      return State[this.stateMachine.state];
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
    transparent(): Array<{ x: number; y: number; id: number } | Bond> {
      const transp = [];
      if (
        this.stateMachine.state === State.PLACING_ATOM ||
        this.stateMachine.state === State.PLACING_ATOM_AND_BOND
      ) {
        transp.push(this.rgroups[this.rgroups.length - 1]);
        transp.push(...this.bonds);
      } else if (this.stateMachine.state === State.MOVING_ATOM) {
        transp.push(...this.selected);
        transp.push(...this.bonds);
      } else if (
        this.stateMachine.state === State.PLACING_LONE_PAIR ||
        this.stateMachine.state === State.SELECTING
      ) {
        transp.push(...this.bonds);
      } else if (this.stateMachine.state === State.ANGLING_LONE_PAIR) {
        transp.push(...this.rgroups);
        transp.push(...this.bonds);
      }
      return transp;
    },
    ipos0(): { x: number; y: number } {
      return this.stateMachine.stateVariables.ipos[0];
    },
    count(): number {
      return this.stateMachine.stateVariables.count;
    },
    classes(): string[] {
      const clazzes = ["surface"];
      if (this.omit) {
        clazzes.push("omit");
      }
      return clazzes;
    },
    simulateLonePair(): boolean {
      return (
        this.stateMachine.state === State.PLACING_LONE_PAIR &&
        !this.stateMachine.stateVariables.selected.length
      );
    },
    simulateArrow(): boolean {
      return (
        this.stateMachine.state === State.PLACING_STRAIGHT_ARROW ||
        this.stateMachine.state === State.PLACING_CURVED_ARROW
      );
    },
    stubby(): boolean {
      return this.stateMachine.state === State.PLACING_CURVED_ARROW;
    }
  },
  methods: {
    handleButtonClick(payload: { target: string; payload: ChemicalElement }) {
      this.stateMachine.execute(Action.BUTTON, payload);
      if (payload.target === "spawn") {
        this.lastElement = payload.payload;
      }
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
    handleMouseDownBond(bond: Bond) {
      this.stateMachine.execute(Action.MOUSE_DOWN, {
        target: "bond",
        payload: bond
      });
    },
    handleMouseUpBond(bond: Bond) {
      this.stateMachine.execute(Action.MOUSE_UP, {
        target: "bond",
        payload: bond
      });
    },
    handleMouseMoveBond(bond: Bond) {
      this.stateMachine.execute(Action.MOUSE_MOVE, {
        target: "bond",
        payload: bond
      });
    },
    handleBondClick(bond: Bond) {
      this.stateMachine.execute(Action.CLICK, {
        target: "bond",
        payload: bond
      });
    },
    handleBondDblClick(bond: Bond) {
      this.stateMachine.execute(Action.DOUBLE_CLICK, {
        target: "bond",
        payload: bond
      });
    },
    newFile() {
      this.dialogging = false;
    },
    handleKey(event: KeyboardEvent) {
      if (!this.dialogging) {
        if (event.key === "Escape") {
          this.stateMachine.execute(Action.CANCEL, {
            target: "",
            payload: undefined
          });
        } else if (event.key === "z" && event.ctrlKey) {
          this.stateMachine.undo(this.stateMachine);
        } else if (
          ((event.key === "z" || event.key === "Z") &&
            event.ctrlKey &&
            event.shiftKey) ||
          (event.key === "y" && event.ctrlKey)
        ) {
          this.stateMachine.redo(this.stateMachine);
        } else if (event.key === "Delete") {
          this.stateMachine.deleteSelected();
        } else if (event.key === "x" && event.ctrlKey) {
          this.clipboard = this.stateMachine.copySelected();
          this.stateMachine.deleteSelected();
        } else if (event.key === "c" && event.ctrlKey) {
          this.clipboard = this.stateMachine.copySelected();
        } else if (event.key === "v" && event.ctrlKey) {
          this.stateMachine.loadData(this.clipboard, false);
        } else if ((event.key === "s" || event.key === "S") && event.ctrlKey) {
          //Save
        } else if (event.key === "o" && event.ctrlKey) {
          //Open
        } else if (event.key === "o") {
          this.omit = !this.omit;
        } else if (event.key === "i" && event.ctrlKey) {
          //Load
        } else if (event.key === "-") {
          const selected = this.selected.filter(
            r => r instanceof RGroup
          ) as RGroup[];
          selected.forEach(r => r.charge--);
          this.stateMachine.log(
            _ => selected.forEach(r => r.charge++),
            _ => {
              selected.forEach(r => r.charge--);
            }
          );
        } else if (event.key === "+") {
          const selected = this.selected.filter(
            r => r instanceof RGroup
          ) as RGroup[];
          selected.forEach(r => r.charge++);
          this.stateMachine.log(
            _ => selected.forEach(r => r.charge--),
            _ => {
              selected.forEach(r => r.charge++);
            }
          );
        } else if (event.key === " ") {
          this.handleButtonClick({
            target: "spawn",
            payload: this.lastElement
          });
        } else return;
        event.preventDefault();
      }
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
