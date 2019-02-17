<template>
  <svg :x="bond.start.x" :y="bond.start.y" class="bond">
    <line
      v-if="isSingleBond || !bond.bondOrder"
      x1="0"
      y1="0"
      :x2="dist"
      y2="0"
      :class="bond.bondOrder ? 'single' : 'partial'"
    ></line>
    <polygon v-else-if="bond.bondOrder == 1" :class="isApproachingBond ? 'solid' : 'patchy'"></polygon>
    <svg v-else-if="bond.bondOrder == 2">
      <line
        :y1="shortenRight ? 0 : 3.75"
        :y2="shortenRight ? 0 : 3.75"
        :x1="shortenLeft ? dist / 7 : 0"
        :x2="shortenLeft ? dist * 6 / 7 : dist"
      ></line>
      <line
        :y1="shortenLeft ? 0 : -3.75"
        :y2="shortenLeft ? 0 : -3.75"
        :x1="shortenRight ? dist / 7 : 0"
        :x2="shortenLeft ? dist * 6 / 7 : dist"
      ></line>
    </svg>
    <svg v-else-if="bond.bondOrder == 3">
      <line y1="5" y2="5" :x1="shortenLeft ? dist / 7 : 0" :x2="shortenLeft ? dist * 6 / 7 : dist"></line>
      <line y1="0" y2="0" x1="0" :x2="dist"></line>
      <line
        y1="-5"
        y2="-5"
        :x1="shortenRight ? dist / 7 : 0"
        :x2="shortenRight ? dist * 6 / 7 : dist"
      ></line>
    </svg>
  </svg>
</template>
<script lang="ts">
import Vue from "vue";
import { Bond, BondState } from "../../models";
const defaultTypes = [
  BondState.PARTIAL,
  BondState.SINGLE_LINEAR,
  BondState.DOUBLE_LINEAR,
  BondState.TRIPLE_LINEAR
];
const increments = [
  [
    BondState.SINGLE_LINEAR,
    BondState.SINGLE_APPROACHING,
    BondState.SINGLE_RECEDING
  ],
  [BondState.DOUBLE_LINEAR, BondState.DOUBLE_LEFT, BondState.DOUBLE_RIGHT],
  [BondState.TRIPLE_LINEAR, BondState.TRIPLE_SHORT]
];
export default Vue.extend({
  props: {
    bond: Bond
  },
  data: function() {
    return {
      visualState: 0
    };
  },
  computed: {
    isSingleBond(): boolean {
      return this.bond.state == BondState.SINGLE_LINEAR;
    },
    isApproachingBond(): boolean {
      return this.bond.state == BondState.SINGLE_APPROACHING;
    },
    dist(): number {
      return Math.hypot(
        this.bond.start.x - this.bond.end.x,
        this.bond.start.y - this.bond.end.y
      );
    },
    angle(): number {
      return Math.atan2(
        this.bond.end.y - this.bond.start.y,
        this.bond.end.x - this.bond.start.x
      );
    },
    shortenLeft(): boolean {
      return (
        this.bond.state == BondState.DOUBLE_LEFT ||
        this.bond.state == BondState.TRIPLE_SHORT
      );
    },
    shortenRight(): boolean {
      return (
        this.bond.state == BondState.DOUBLE_RIGHT ||
        this.bond.state == BondState.TRIPLE_SHORT
      );
    },
    classes(): string[] {
      let clazzes = ["bond"];
      if (this.bond == this.$store.state.molecules.stateMachine.adding)
        clazzes.push("transparent");
      return clazzes;
    }
  },
  methods: {
    async switchState(order: boolean) {
      let bondState;
      if (order) {
        bondState =
          defaultTypes[(this.bond.bondOrder + 1) % defaultTypes.length];
      } else {
        switch (this.bond.bondOrder) {
          case 0:
            return;
          case 1:
            bondState =
              increments[0][
                (this.bond.state - BondState.SINGLE_LINEAR + 1) %
                  increments[0].length
              ];
            break;
          case 2:
            bondState =
              increments[1][
                (this.bond.state - BondState.DOUBLE_LINEAR + 1) %
                  increments[1].length
              ];
            break;
          case 3:
            bondState =
              increments[2][
                (this.bond.state - BondState.TRIPLE_LINEAR + 1) %
                  increments[2].length
              ];
            break;
        }
      }
      this.$store.dispatch("molecules/changeBondState", {
        bond: this.bond,
        bondState
      });
    }
  }
});
</script>