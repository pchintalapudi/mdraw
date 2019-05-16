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
      <straight-arrow-vue v-for="arrow in straightArrows" :key="arrow.id" :arrow="arrow"></straight-arrow-vue>
      <bond-vue
        v-for="bond in bonds"
        :key="bond.id"
        :bond="bond"
        :transparent="transparent.includes(bond)"
        @click-bond="handleBondClick"
        @dblclick-bond="handleBondDblClick"
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
      <lone-pair-simulator-vue v-if="simulateLonePair" :position="ipos0" :count="count"></lone-pair-simulator-vue>
      <arrow-simulator-vue v-if="simulateArrow" :stubby="stubby" :position="ipos0"></arrow-simulator-vue>
      <angler-vue :offset="offset" :angle="angle" :bond="bond" v-if="angling"></angler-vue>
      <selection-rectangle-vue v-if="selecting" :selection-rectangle="selectionBox"></selection-rectangle-vue>
    </svg>
    <touchbar-vue class="touch-bar" @button-click="handleButtonClick"></touchbar-vue>
    <file-chooser-vue v-if="dialogging" :save="saving" @close="closeDialog" @new-file="newFile"></file-chooser-vue>
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
  StraightArrow
} from "../models";
import { saveFile, loadFile } from "../files";
import RGroupVue from "@/components/molecules/RGroup.vue";
import BondVue from "@/components/molecules/Bond.vue";
import LonePairSimulatorVue from "@/components/molecules/LonePairSimulator.vue";
import ArrowSimulatorVue from "@/components/molecules/ArrowSimulator.vue";
import StraightArrowVue from "@/components/molecules/StraightArrow.vue";
import TouchBarVue from "@/components/touchbar/TouchBar.vue";
import SelectionRectangleVue from "@/components/widgets/SelectionBox.vue";
import AnglerVue from "@/components/widgets/Angler.vue";
import FileChooserVue from "@/components/files/FileChooser.vue";
export default Vue.extend({
  components: {
    "bond-vue": BondVue,
    "rgroup-vue": RGroupVue,
    "straight-arrow-vue": StraightArrowVue,
    "arrow-simulator-vue": ArrowSimulatorVue,
    "lone-pair-simulator-vue": LonePairSimulatorVue,
    "touchbar-vue": TouchBarVue,
    "selection-rectangle-vue": SelectionRectangleVue,
    "angler-vue": AnglerVue,
    "file-chooser-vue": FileChooserVue
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
    window.addEventListener("beforeunload", ev => {
      if (!this.stateMachine.stateVariables.saved) {
        ev.preventDefault();
        return "Don't close yet";
      }
    });
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
    selectionBox(): SelectionRectangle {
      return this.stateMachine.stateVariables.selectionBox;
    },
    selecting(): boolean {
      return this.stateMachine.state === State.SELECTING;
    },
    selected(): RGroup[] {
      return this.stateMachine.stateVariables.selected;
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
        transp.push(this.rgroups[this.rgroups.length - 1]);
        transp.push(...this.bonds);
      } else if (this.stateMachine.state === State.MOVING_ATOM) {
        transp.push(...this.selected);
      } else if (this.stateMachine.state === State.PLACING_LONE_PAIR) {
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
    openDialog(save: boolean, load = false) {
      if (
        !save &&
        !load &&
        !this.stateMachine.stateVariables.saved &&
        confirm("Would you like to save your content?")
      ) {
        this.deserializeOnSave = true;
        this.openDialog(true, false);
      }
      this.dialogging = true;
      this.saving = save ? this.stateMachine.stateVariables.serialize() : "";
      this.loading = load;
    },
    closeDialog(response: [boolean, string]) {
      if (this.saving) {
        if (response[0]) {
          this.stateMachine.stateVariables.file = response[1];
          this.stateMachine.stateVariables.save();
          if (this.deserializeOnSave) {
            this.openDialog(false, false);
          }
        }
        this.deserializeOnSave = false;
      } else {
        if (response[0]) {
          if (!this.stateMachine.stateVariables.saved) {
            if (this.stateMachine.stateVariables.file) {
              saveFile(
                this.stateMachine.stateVariables.file,
                this.stateMachine.stateVariables.serialize(),
                true
              );
            } else {
              this.openDialog(true);
            }
          }
          this.stateMachine.stateVariables.deserialize(
            loadFile(response[1]),
            !this.loading
          );
          if (!this.loading) {
            this.stateMachine.stateVariables.file = response[1];
          }
        }
      }
      this.dialogging = false;
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
          this.stateMachine.stateVariables.undo(this.stateMachine);
        } else if (
          ((event.key === "z" || event.key === "Z") &&
            event.ctrlKey &&
            event.shiftKey) ||
          (event.key === "y" && event.ctrlKey)
        ) {
          this.stateMachine.stateVariables.redo(this.stateMachine);
        } else if (event.key === "Delete") {
          this.stateMachine.stateVariables.delete();
        } else if (event.key === "x" && event.ctrlKey) {
          this.clipboard = this.stateMachine.stateVariables.copy();
          this.stateMachine.stateVariables.delete();
        } else if (event.key === "c" && event.ctrlKey) {
          this.clipboard = this.stateMachine.stateVariables.copy();
        } else if (event.key === "v" && event.ctrlKey) {
          this.stateMachine.stateVariables.deserialize(this.clipboard);
        } else if ((event.key === "s" || event.key === "S") && event.ctrlKey) {
          if (!event.shiftKey && this.stateMachine.stateVariables.file) {
            saveFile(
              this.stateMachine.stateVariables.file,
              this.stateMachine.stateVariables.serialize(),
              true
            );
            this.stateMachine.stateVariables.save();
          } else this.openDialog(true);
        } else if (event.key === "o" && event.ctrlKey) {
          this.openDialog(false);
        } else if (event.key === "o") {
          this.omit = !this.omit;
        } else if (event.key === "i" && event.ctrlKey) {
          this.openDialog(false, true);
        } else if (event.key === "-") {
          this.selected.forEach(r => r.charge--);
          const selected = [...this.selected];
          this.stateMachine.stateVariables.log(
            _ => selected.forEach(r => r.charge++),
            _ => {
              selected.forEach(r => r.charge--);
            }
          );
        } else if (event.key === "+") {
          this.selected.forEach(r => r.charge++);
          const selected = [...this.selected];
          this.stateMachine.stateVariables.log(
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
