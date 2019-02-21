<template>
  <svg
    @pointerup="finishGesture"
    @pointermove="move"
    @pointerdown="requestSelect"
    :class="classes"
    tabindex="0"
  >
    <defs>
      <pattern id="patchy" width="5" height="10" patternUnits="userSpaceOnUse">
        <line stroke="black" stroke-width="4px" y2="10"></line>
      </pattern>
    </defs>
    <angler-assist v-if="assist"></angler-assist>
    <bond-element v-for="bond in bonds" :key="bond.id" :bond="bond"></bond-element>
    <rgroup-element v-for="rgroup in rgroups" :key="rgroup.id" :r-group="rgroup"></rgroup-element>
    <selection-box v-if="selecting"></selection-box>
  </svg>
</template>
<script lang="ts">
import Vue from "vue";
import { RGroup, Bond, DrawerState } from "../../models/";
import RGroupVue from "../molecules/RGroup.vue";
import BondVue from "../molecules/Bond.vue";
import AnglerVue from "./widgets/Angler.vue";
import SelectionVue from "./Selection.vue";
export default Vue.extend({
  components: {
    "rgroup-element": RGroupVue,
    "bond-element": BondVue,
    "angler-assist": AnglerVue,
    "selection-box": SelectionVue
  },
  data: function() {
    return { keydown: undefined as any };
  },
  computed: {
    rgroups(): RGroup[] {
      return this.$store.state.molecules.rgroups;
    },
    bonds(): Bond[] {
      return this.$store.state.molecules.bonds;
    },
    assist(): boolean {
      return (
        this.$store.state.molecules.stateMachine.state ==
        DrawerState.PLACING_NEW_ATOM_AND_BOND
      );
    },
    classes(): string[] {
      let clazzes = [] as string[];
      if (this.$store.state.molecules.omitting) clazzes.push("omit");
      return clazzes;
    },
    selecting(): boolean {
      return (
        this.$store.state.molecules.stateMachine.state === DrawerState.SELECTING
      );
    }
  },
  mounted() {
    this.$store.commit("molecules/setDrawPane", this.$el);
    document.onkeydown = (event: KeyboardEvent) => {
      if (this.$el.contains(document.activeElement)) {
        switch (event.key) {
          case "z":
            if (event.ctrlKey) this.$store.commit("history/undo");
            else return;
            break;
          case "Z":
            if (!event.shiftKey || !event.ctrlKey) return;
          case "y":
          case "Y":
            if (event.ctrlKey) this.$store.commit("history/redo");
            else return;
            break;
          case "Escape":
            this.$store.dispatch("molecules/defaultCancel");
            break;
          case "o":
            if (!event.ctrlKey)
              this.$store.commit(
                "molecules/omit",
                !this.$store.state.molecules.omitting
              );
            else {
              this.$store.commit("files/openLoad");
            }
            break;
          case "s":
            if (event.ctrlKey) {
              this.$store.commit("files/openSave");
              break;
            }
            return;
          case " ":
            this.$store.dispatch("molecules/createAtom");
            break;
          case "Delete":
            this.$store.dispatch("molecules/delete");
          default:
            return;
        }
        event.preventDefault();
      }
    };
  },
  beforeDestroy() {
    document.onkeydown = null;
  },
  methods: {
    finishGesture(event: PointerEvent) {
      if (!event.button) this.$store.dispatch("molecules/finishGesture");
    },
    move(event: PointerEvent) {
      this.$store.dispatch("molecules/moveEvent", {
        x: event.offsetX,
        y: event.offsetY
      });
    },
    requestSelect(event: PointerEvent) {
      if (!event.button)
        this.$store.commit("molecules/requestSelect", {
          x: event.offsetX,
          y: event.offsetY
        });
    }
  }
});
</script>
