<template>
  <svg @pointerup="finishGesture" @pointermove="move">
    <defs>
      <pattern id="patchy" width="5" height="10" patternUnits="userSpaceOnUse">
        <line stroke="black" stroke-width="4px" y2="10"/>
      </pattern>
    </defs>
    <angler-assist v-if="assist"></angler-assist>
    <bond-element v-for="bond in bonds" :key="bond.id" :bond="bond"></bond-element>
    <rgroup-element v-for="rgroup in rgroups" :key="rgroup.id" :r-group="rgroup"></rgroup-element>
  </svg>
</template>
<script lang="ts">
import Vue from "vue";
import { RGroup, Bond, DrawerState } from "../../models/";
import RGroupVue from "../molecules/RGroup.vue";
import BondVue from "../molecules/Bond.vue";
import AnglerVue from "./widgets/Angler.vue";
export default Vue.extend({
  components: {
    "rgroup-element": RGroupVue,
    "bond-element": BondVue,
    "angler-assist": AnglerVue
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
    }
  },
  mounted() {
    this.$store.commit("molecules/setDrawPane", this.$el);
    document.onkeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key == "z") {
        this.$store.commit("history/undo");
      } else if (
        (event.ctrlKey && (event.shiftKey && event.key == "Z")) ||
        event.key == "y" ||
        event.key == "Y"
      ) {
        this.$store.commit("history/redo");
      } else if (event.key == "Escape") {
        this.$store.dispatch("molecules/defaultCancel");
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
    }
  }
});
</script>
