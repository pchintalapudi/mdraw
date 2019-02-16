<template>
  <svg
    :class="classes"
    :x="x - radius"
    :y="y - radius"
    :viewBox="outerViewBox"
    @onpointerdown="pointerDown"
    @onpointerup="pointerUp"
  >
    <circle :cx="radius" :cy="radius" :r="radius"></circle>
    <svg :x="x - contentWidth / 2" :y="y - contentHeight" :viewBox="innerViewBox">
      <text class="name" ref="content">{{name}}</text>
      <text
        class="charge"
        v-if="charge"
        ref="charge"
        :x="x + contentWidth / 2 + 2"
        :y="y - contentHeight / 2 - chargeHeight / 2"
      >{{charge.toString()}}</text>
    </svg>
  </svg>
</template>
<script lang="ts">
import Vue from "vue";
import { RGroup } from "../../models";
export default Vue.extend({
  props: {
    rGroup: RGroup
  },
  data: function() {
    return { plock: 0 };
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
      return (this.$refs["content"] as SVGTextElement).getBBox().width;
    },
    contentHeight(): number {
      return (this.$refs["content"] as SVGTextElement).getBBox().height;
    },
    chargeWidth(): number {
      return (this.$refs["charge"] as SVGTextElement).getBBox().width;
    },
    chargeHeight(): number {
      return (this.$refs["charge"] as SVGTextElement).getBBox().height;
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
        -this.radius / 2 +
        " " +
        -this.radius / 2 +
        " " +
        this.radius / 2 +
        " " +
        this.radius / 2
      );
    },
    classes(): string[] {
      let clazzes = ["rgroup"];
      if (this.rGroup == this.$store.state.molecules.stateMachine.placing)
        clazzes.push("transparent");
      return clazzes;
    }
  },
  methods: {
    pointerDown(event: PointerEvent) {
    },
    pointerUp(event: PointerEvent) {
    }
  }
});
</script>
