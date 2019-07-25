<template>
  <g data-group="constructs">
    <straight-arrow-vue
      v-for="arrow in straightArrows"
      :key="arrow.id"
      :arrow="arrow"
      :selected="selected.has(arrow)"
      :class="transparent.has(arrow) ? 'transparent' : 'not-transparent'"
      :d3="d3"
    ></straight-arrow-vue>
    <g :class="bondsTransparent ? 'transparent' : 'not-transparent'" data-group="bonds">
      <bond-vue
        v-for="bond in bonds"
        :key="bond.id"
        :bond="bond"
        @click-bond="handleClick"
        @dblclick-bond="handleDblClick"
        @dmouse="handleMouseDown"
        @mmouse="handleMouseMove"
        @umouse="handleMouseUp"
        :omitting="omit"
        :d3="d3"
      ></bond-vue>
    </g>
    <template v-if="rawRGroups.length > 1">
      <g
        v-if="!selectedTransparent"
        :class="rgroupsTransparent ? 'transparent' : 'not-transparent'"
      >
        <rgroup-vue
          v-for="rgroup in shortRGroups"
          :key="rgroup.id"
          :rgroup="rgroup"
          @dmouse="handleMouseDown"
          @mmouse="handleMouseMove"
          @umouse="handleMouseUp"
          :selected="selected.has(rgroup)"
          :omitting="omit"
          :d3="d3"
        ></rgroup-vue>
      </g>
      <g v-else>
        <rgroup-vue
          v-for="rgroup in shortRGroups"
          :key="rgroup.id"
          :rgroup="rgroup"
          @dmouse="handleMouseDown"
          @mmouse="handleMouseMove"
          @umouse="handleMouseUp"
          :selected="selected.has(rgroup)"
          :omitting="omit"
          :d3="d3"
          :class="selected.has(rgroup) || rgroup === stateMachine.stateVariables.temp.point ? 'transparent' : 'not-transparent'"
        ></rgroup-vue>
      </g>
    </template>
    <rgroup-vue
      v-if="rawRGroups.length && (!omit || !endRGroup.omittable)"
      :rgroup="endRGroup"
      @dmouse="handleMouseDown"
      @mmouse="handleMouseMove"
      @umouse="handleMouseUp"
      :selected="selected.has(endRGroup)"
      :omitting="omit"
      :d3="d3"
      :class="endRGroupTransparent ? 'transparent' : 'not-transparent'"
    />
    <template v-if="!d3">
      <curved-arrow-vue v-for="arrow in curvedArrows" :key="arrow.id" :arrow="arrow" :d3="d3"></curved-arrow-vue>
    </template>
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
import { WrapperMap, WrapperSet } from "@/utils";
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
    rawRGroups(): RGroup[] {
      return this.stateMachine.stateVariables.rgroups;
    },
    shortRGroups(): RGroup[] {
      const rgroups = this.rawRGroups.slice(0, this.rawRGroups.length - 1);
      return this.omit
        ? rgroups.filter(
            r =>
              !r.omittable ||
              this.selected.has(r) ||
              this.stateMachine.stateVariables.temp.point === r
          )
        : rgroups;
    },
    endRGroup(): RGroup {
      return this.rawRGroups[this.rawRGroups.length - 1];
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
    bondsTransparent(): boolean {
      switch (this.stateMachine.state) {
        default:
          return false;
        case State.PLACING_ATOM:
        case State.PLACING_ATOM_AND_BOND:
        case State.PLACING_LONE_PAIR:
        case State.SELECTING:
        case State.MOVING_ATOM:
        case State.ANGLING_LONE_PAIR:
          return true;
      }
    },
    rgroupsTransparent(): boolean {
      switch (this.stateMachine.state) {
        default:
          return false;
        case State.ANGLING_LONE_PAIR:
        case State.SELECTING:
          return true;
      }
    },
    endRGroupTransparent(): boolean {
      switch (this.stateMachine.state) {
        default:
          return this.rgroupsTransparent;
        case State.MOVING_ATOM:
          return (
            this.selected.has(this.endRGroup) ||
            this.stateMachine.stateVariables.temp.point === this.endRGroup
          );
        case State.PLACING_ATOM:
        case State.PLACING_ATOM_AND_BOND:
        case State.ANGLING_LONE_PAIR:
          return true;
      }
    },
    selectedTransparent(): boolean {
      return this.stateMachine.state === State.MOVING_ATOM;
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
