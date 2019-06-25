<template>
  <g data-group="constructs">
    <straight-arrow-vue
      v-for="arrow in straightArrows"
      :key="arrow.id"
      :arrow="arrow"
      :selected="selected.includes(arrow)"
      :d3="d3"
    ></straight-arrow-vue>
    <bond-vue
      v-for="bond in bonds"
      :key="bond.id"
      :bond="bond"
      :transparent="transparent.includes(bond)"
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
      :transparent="transparent.includes(rgroup)"
      :selected="selected.includes(rgroup)"
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
    selected(): Array<RGroup | StraightArrow> {
      return this.stateMachine.stateVariables.selected;
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
      this.stateMachine.execute(Action.MOUSE_UP, payload);
    },
    handleMouseDown(payload: { target: string; payload: any }) {
      this.stateMachine.execute(Action.MOUSE_DOWN, payload);
    },
    handleMouseMove(payload: { target: string; payload: any }) {
      this.stateMachine.execute(Action.MOUSE_MOVE, payload);
    }
  }
});
</script>