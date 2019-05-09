<template>
  <g
    :class="classes"
    :transform="`translate(${x - contentWidth / 2} ${y + contentHeight / 4})`"
    @pointerdown.stop="pointerDown"
    @pointerup.stop="pointerUp"
    @pointermove.stop="pointerMove"
  >
    <circle
      :r="abbrev.length == 1 ? 15 : 25"
      :cx="contentWidth / 2"
      :cy="-contentHeight / 4"
      fill="transparent"
    />
    <circle
      :r="abbrev.length == 1 ? 10 : 20"
      :cx="contentWidth / 2"
      :cy="-contentHeight / 4"
      fill="white"
    />
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
<script lang='ts'>
import Vue from "vue";
import { RGroup } from "../../models";
export default Vue.extend({
  props: {
    rgroup: RGroup,
    transparent: Boolean,
    selected: Boolean
  },
  data() {
    return {
      contentElement: undefined as SVGTextElement | undefined,
      chargeElement: undefined as SVGTextElement | undefined
    };
  },
  mounted() {
    this.contentElement = this.$refs.content as SVGTextElement;
    this.chargeElement = this.$refs.charge as SVGTextElement;
  },
  computed: {
    name(): string {
      return this.rgroup.payload.name;
    },
    abbrev(): string {
      return this.rgroup.payload.abbrev || this.name;
    },
    x(): number {
      return this.rgroup.x;
    },
    y(): number {
      return this.rgroup.y;
    },
    charge(): number {
      return this.rgroup.charge;
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
      return `0 ${this.charge ? -this.chargeHeight / 2 : 0} ${this.netWidth} ${
        this.netHeight
      }`;
    },
    radius(): number {
      return Math.hypot(
        this.netWidth - this.contentWidth / 2,
        this.netHeight / 2
      );
    },
    outerViewBox(): string {
      return `${-this.radius} ${-this.radius} ${this.radius} ${this.radius}`;
    },
    omittable(): boolean {
      return false;
    },
    classes(): string[] {
      const clazzes: string[] = [];
      if (this.transparent) {
        clazzes.push("transparent");
      }
      if (this.omittable) {
        clazzes.push("omittable");
      }
      if (this.selected) {
        clazzes.push("selected");
      }
      return clazzes;
    }
  },
  methods: {
    pointerDown(event: PointerEvent) {
      const rgroup = this.rgroup;
      this.$emit("dmouse", { target: "rgroup", payload: rgroup });
    },
    pointerUp(event: PointerEvent) {
      const rgroup = this.rgroup;
      this.$emit("umouse", { target: "rgroup", payload: rgroup });
    },
    pointerMove(event: PointerEvent) {
      const rgroup = this.rgroup;
      this.$emit("mmouse", { target: "rgroup", payload: rgroup });
    }
  }
});
</script>
<style scoped>
::selection {
  background-color: transparent;
  color: inherit;
}

.transparent {
  pointer-events: none;
}

.abbrev,
.charge {
  cursor: default;
}

.selected > :first-child {
  fill: #0088ff44;
}

.selected {
  opacity: 1 !important;
}
</style>
