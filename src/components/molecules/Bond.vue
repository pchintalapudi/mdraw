<template>
  <g
    :transform="'translate(' + bond.start.x + ' ' + bond.start.y + ') rotate(' + angle + ')'"
    :class="classes"
    @pointerdown.stop
    @click="click"
    @dblclick="dblclick"
    @contextmenu.prevent="swapBond"
  >
    <line class="clickme" x1="0" y1="0" :x2="dist" y2="0"/>
    <line
      v-if="isSingleBond || !bond.bondOrder"
      x1="0"
      y1="0"
      :x2="dist"
      y2="0"
      :class="bond.bondOrder ? 'single' : 'partial'"
    ></line>
    <polygon
      v-else-if="bond.bondOrder == 1"
      :style="'fill:' + (isApproachingBond ? 'black' : 'url(#patchy)') + ';stroke:transparent'"
      :points="points"
    ></polygon>
    <g v-else-if="bond.bondOrder == 2">
      <line
        :y1="shortenRight ? 0 : 3.75"
        :y2="shortenRight ? 0 : 3.75"
        :x1="shortenLeft ? dist * shorten : 0"
        :x2="shortenLeft ? dist * (1-shorten) : dist"
      ></line>
      <line
        :y1="shortenLeft ? 0 : -3.75"
        :y2="shortenLeft ? 0 : -3.75"
        :x1="shortenRight ? dist * shorten : 0"
        :x2="shortenRight ? dist * (1-shorten) : dist"
      ></line>
    </g>
    <g v-else-if="bond.bondOrder == 3">
      <line
        y1="5"
        y2="5"
        :x1="shortenLeft ? dist * shorten : 0"
        :x2="shortenLeft ? dist * (1-shorten) : dist"
      ></line>
      <line y1="0" y2="0" x1="0" :x2="dist"></line>
      <line
        y1="-5"
        y2="-5"
        :x1="shortenRight ? dist * shorten : 0"
        :x2="shortenRight ? dist * (1-shorten) : dist"
      ></line>
    </g>
  </g>
</template>
<script lang="ts">
import Vue from "vue";
import { Bond, BondState } from "../../models";
import { elements } from "../../models";
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
      visualState: 0,
      shorten: 2 / 7
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
      return (
        (180 / Math.PI) *
        Math.atan2(
          this.bond.end.y - this.bond.start.y,
          this.bond.end.x - this.bond.start.x
        )
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
    transparent(): boolean {
      return (
        !!this.$store.state.molecules.stateMachine.creating ||
        this.$store.state.molecules.pointerState.end
      );
    },
    classes(): string[] {
      let clazzes = ["bond"];
      if (this.transparent) clazzes.push("transparent");
      let start = this.bond.start,
        end = this.bond.end;
      if (start.payload == elements[1 - 1]) {
        if (end.payload == elements[6 - 1]) {
          clazzes.push("omittable");
        }
      } else if (start.payload == elements[6 - 1]) {
        if (end.payload == elements[1 - 1]) {
          clazzes.push("omittable");
        }
      }
      return clazzes;
    },
    points(): string {
      let pts = [0 + "," + 0];
      pts.push(this.dist - 10 + "," + 5);
      pts.push(this.dist - 10 + "," + -5);
      return pts.join(" ");
    }
  },
  methods: {
    click(event: MouseEvent) {
      if (!event.button) {
        this.switchState(false);
        event.stopPropagation();
      }
    },
    dblclick(event: MouseEvent) {
      if (!event.button) {
        this.switchState(true);
        event.stopPropagation();
      }
    },
    swapBond() {
      this.$store.dispatch("molecules/flipBond", this.bond);
    },
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