<template>
  <div class="wrapper">
    <svg-vue :class="classes">
      <molecule-vue :state-machine="stateMachine" :omit="omit" :d3="d3"></molecule-vue>
      <widget-vue :state-machine="stateMachine"></widget-vue>
    </svg-vue>
    <touchbar-vue class="touch-bar" :state-machine="stateMachine"></touchbar-vue>
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
import MoleculeVue from "@/components/molecules/MoleculeView.vue";
import WidgetVue from "@/components/widgets/WidgetView.vue";
import TouchBarVue from "@/components/touchbar/TouchBar.vue";
import SVGVue from "@/components/molecules/SVGView.vue";
export default Vue.extend({
  components: {
    "svg-vue": SVGVue,
    "molecule-vue": MoleculeVue,
    "widget-vue": WidgetVue,
    "touchbar-vue": TouchBarVue
  },
  data() {
    return {
      stateMachine: new StateMachine(),
      clipboard: "",
      omit: false,
      lastElement: element(6),
      lockout: false,
      d3: true
    };
  },
  mounted() {
    init_transforms();
    window.addEventListener("keydown", this.handleKey);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKey);
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
  },
  methods: {
    handleKey(event: KeyboardEvent) {
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
