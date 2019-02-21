<template>
  <g
    :class="classes"
    :transform="'translate(' + (x - contentWidth / 2) + ' ' + (y + contentHeight / 4) + ')'"
    @pointerdown="pointerDown"
    @pointerup="pointerUp"
    @pointermove="pointerMove"
  >
    <circle
      :r="abbrev.length == 1 ? 15 : 25"
      :cx="contentWidth / 2"
      :cy="-contentHeight / 4"
    />
    <circle :r="abbrev.length == 1 ? 10 : 20" :cx="contentWidth / 2" :cy="-contentHeight / 4"></circle>
    <text class="abbrev" ref="content">{{abbrev}}</text>
    <text
      class="charge"
      v-if="charge"
      ref="charge"
      :x="x + contentWidth / 2 + 2"
      :y="y - contentHeight / 2 - chargeHeight / 2"
    >{{charge.toString()}}</text>
  </g>
</template>
<script lang="ts">
import Vue from "vue";
import { RGroup } from "../../models";
import { elements } from "../../models";
export default Vue.extend({
  props: {
    rGroup: RGroup
  },
  data: function() {
    return {
      plock: 0,
      contentElement: undefined as SVGTextElement | undefined,
      chargeElement: undefined as SVGTextElement | undefined
    };
  },
  mounted: function() {
    this.contentElement = this.$refs.content as SVGTextElement;
    this.chargeElement = this.$refs.charge as SVGTextElement;
  },
  computed: {
    name(): string {
      return this.rGroup.payload.name;
    },
    abbrev(): string {
      return this.rGroup.payload.abbrev;
    },
    x(): number {
      return this.rGroup.x;
    },
    y(): number {
      return this.rGroup.y;
    },
    charge(): number {
      return this.rGroup.charge;
    },
    contentWidth(): number {
      return this.contentElement ? this.contentElement.getBBox().width : 0;
    },
    contentHeight(): number {
      return this.contentElement ? this.contentElement.getBBox().height : 0;
    },
    chargeWidth(): number {
      return this.chargeElement ? this.chargeElement!.getBBox().width : 0;
    },
    chargeHeight(): number {
      return this.chargeElement ? this.chargeElement.getBBox().height : 0;
    },
    netWidth(): number {
      return this.contentWidth + (this.charge ? this.chargeWidth + 2 : 0);
    },
    netHeight(): number {
      return this.contentHeight + (this.charge ? this.chargeHeight / 2 : 0);
    },
    innerViewBox(): string {
      return (
        "0 " +
        (this.charge ? -this.chargeHeight / 2 : 0) +
        " " +
        this.netWidth +
        " " +
        this.netHeight
      );
    },
    radius(): number {
      return Math.hypot(
        this.netWidth - this.contentWidth / 2,
        this.netHeight / 2
      );
    },
    outerViewBox(): string {
      return (
        -this.radius +
        " " +
        -this.radius +
        " " +
        this.radius +
        " " +
        this.radius
      );
    },
    transparent(): boolean {
      return this.rGroup == this.$store.state.molecules.stateMachine.creating;
    },
    omittable(): boolean {
      return (
        this.rGroup.payload == elements[6 - 1] ||
        (this.rGroup.payload == elements[1 - 1] &&
          this.rGroup.bonds.size == 1 &&
          this.rGroup.bonds
            .values()
            .next()
            .value.getPeer(this.rGroup)!.payload == elements[6 - 1])
      );
    },
    selected(): boolean {
      return (
        this.$store.state.molecules.stateMachine.selected.indexOf(
          this.rGroup
        ) !== -1
      );
    },
    classes(): string[] {
      let clazzes = ["rgroup"];
      if (this.transparent) clazzes.push("transparent");
      if (this.omittable) clazzes.push("omittable");
      if (this.selected) clazzes.push("selected");
      return clazzes;
    }
  },
  methods: {
    pointerDown(event: PointerEvent) {
      if (!event.button) {
        this.$store.commit("molecules/startMove", this.rGroup);
        event.stopPropagation();
      }
    },
    pointerUp(event: PointerEvent) {
      if (!event.button) {
        this.$store.dispatch("molecules/rgroupEnd", this.rGroup);
        event.stopPropagation();
      }
    },
    pointerMove(event: PointerEvent) {
      if (!this.transparent) {
        this.$store.dispatch("molecules/moveEvent", {
          x: this.x,
          y: this.y,
          force: true
        });
        event.stopPropagation();
      }
    }
  }
});
</script>
