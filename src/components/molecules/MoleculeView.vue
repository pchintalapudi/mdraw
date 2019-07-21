<template>
  <g data-group="constructs">
    <straight-arrow-vue
      v-for="arrow in straightArrows"
      :key="arrow.id"
      :arrow="arrow"
      :selected="selected.has(arrow)"
      :d3="d3"
    ></straight-arrow-vue>
    <bond-vue
      v-for="bond in bonds"
      :key="bond.id"
      :bond="bond"
      :transparent="transparent.has(bond)"
      @click-bond="handleClick"
      @dblclick-bond="handleDblClick"
      @dmouse="handleMouseDown"
      @mmouse="handleMouseMove"
      @umouse="handleMouseUp"
      :omitting="omit"
      :d3="d3"
    ></bond-vue>
    <rgroup-vue
      v-for="rgroup in rgroups"
      :key="rgroup.id"
      :rgroup="rgroup"
      @dmouse="handleMouseDown"
      @mmouse="handleMouseMove"
      @umouse="handleMouseUp"
      :transparent="transparent.has(rgroup)"
      :selected="selected.has(rgroup)"
      :omitting="omit"
      :d3="d3"
    ></rgroup-vue>
    <curved-arrow-vue v-for="arrow in curvedArrows" :key="arrow.id" :arrow="arrow" :d3="d3"></curved-arrow-vue>
  </g>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import RGroupVue from "@/components/molecules/RGroup.vue";
import BondVue from "@/components/molecules/Bond.vue";
import StraightArrowVue from "@/components/molecules/StraightArrow.vue";
import CurvedArrowVue from "@/components/molecules/CurvedArrow.vue";
import { State, Action, StateMachine } from "@/state_machine";
import { RGroup, Bond, StraightArrow, CurvedArrow } from "@/models";
import {WrapperMap, WrapperSet} from "@/utils";
export default Vue.extend({
  components: {
    "bond-vue": BondVue,
    "rgroup-vue": RGroupVue,
    "straight-arrow-vue": StraightArrowVue,
    "curved-arrow-vue": CurvedArrowVue
  },
  props: {
    stateMachine: Object as PropType<StateMachine>,
    omit: Boolean,
    d3: Boolean
  },
  computed: {
    rgroups(): RGroup[] {
      return this.omit
        ? this.stateMachine.stateVariables.rgroups.filter(r => !r.omittable)
        : this.stateMachine.stateVariables.rgroups;
    },
    bonds(): Bond[] {
      return this.omit
        ? this.stateMachine.stateVariables.bonds.filter(b => !b.omittable)
        : this.stateMachine.stateVariables.bonds;
    },
    straightArrows(): StraightArrow[] {
      return this.stateMachine.stateVariables.straightArrows;
    },
    curvedArrows(): CurvedArrow[] {
      return this.stateMachine.stateVariables.curvedArrows;
    },
    selected(): WrapperMap<RGroup | StraightArrow, { x: number; y: number }> {
      return this.stateMachine.stateVariables.selection.selected;
    },
    transparent(): WrapperSet<RGroup | Bond | StraightArrow | CurvedArrow> {
      const transp = new WrapperSet<RGroup | Bond | StraightArrow | CurvedArrow>();
      switch (this.stateMachine.state) {
        case State.PLACING_ATOM_AND_BOND:
        case State.PLACING_ATOM:
          transp.add(this.rgroups[this.rgroups.length - 1]);
        case State.PLACING_LONE_PAIR:
        case State.SELECTING:
          transp.add(...this.bonds);
          break;
        case State.MOVING_ATOM:
          this.selected.forEach((_, rs) => transp.add(rs));
          transp.add(...this.bonds);
          break;
        case State.ANGLING_LONE_PAIR:
          transp.add(...this.rgroups);
          transp.add(...this.bonds);
      }
      return transp;
    },
    transmitLonePair(): boolean {
      switch (this.stateMachine.state) {
        default:
          return false;
        case State.PLACING_CURVED_ARROW:
        case State.DRAWING_CURVED_ARROW:
          return true;
      }
    }
  },
  methods: {
    handleClick(payload: { target: string; payload: any }) {
      this.stateMachine.execute(Action.CLICK, payload);
    },
    handleDblClick(payload: { target: string; payload: any }) {
      this.stateMachine.execute(Action.DOUBLE_CLICK, payload);
    },
    handleMouseUp(payload: { target: string; payload: any }) {
      if (!this.transmitLonePair && payload.target === "lone-pair") {
        payload.target = "rgroup";
        payload.payload = payload.payload.rgroup;
      }
      this.stateMachine.execute(Action.MOUSE_UP, payload);
    },
    handleMouseDown(payload: { target: string; payload: any }) {
      if (!this.transmitLonePair && payload.target === "lone-pair") {
        payload.target = "rgroup";
        payload.payload = payload.payload.rgroup;
      }
      this.stateMachine.execute(Action.MOUSE_DOWN, payload);
    },
    handleMouseMove(payload: { target: string; payload: any }) {
      if (!this.transmitLonePair && payload.target === "lone-pair") {
        payload.target = "rgroup";
        payload.payload = payload.payload.rgroup;
      }
      this.stateMachine.execute(Action.MOUSE_MOVE, payload);
    }
  }
});
</script>
