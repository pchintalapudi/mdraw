<template>
  <g
    @pointerdown.stop="pointerDown"
    @pointerup.stop="pointerUp"
    @pointermove.stop="pointerMove"
    :style="rootStyle"
    class="positioned"
  >
    <title>{{name}}</title>
    <circle
      :r="d3 ? 12.5 : abbrev.length * 5 + 5"
      :fill="d3 ? `url(#color${color}-gradient)` : 'white'"
      :stroke="selected ? '#0088ff44' : 'transparent'"
      stroke-width="10"
      paint-order="stroke"
    />
    <text
      v-if="!d3"
      class="abbrev"
      ref="content"
      text-anchor="middle"
      dominant-baseline="central"
      style="cursor:default;user-select:none;"
    >{{abbrev}}</text>
    <text
      style="visibility:visible;cursor:default;user-select:none;"
      v-if="!d3 && charge"
      :x="abbrev.length * 5 + 2.5"
      y="-5"
      font-size="small"
      ref="charge"
      text-anchor="start"
    >{{chargeText}}</text>
    <lone-pair-vue
      v-for="lp in lonePairs"
      :key="lp.id"
      :lonepair="lp"
      :omitting="omitting"
      @cascade-down="cascadeDown"
      @cascade-move="cascadeMove"
      @cascade-up="cascadeUp"
    ></lone-pair-vue>
  </g>
</template>
<script lang='ts'>
import Vue, { PropType } from "vue";
import LonePairVue from "@/components/molecules/LonePair.vue";
import { RGroup, LonePair, getColor } from "@/models";
export default Vue.extend({
  props: {
    rgroup: Object as PropType<RGroup>,
    transparent: Boolean,
    selected: Boolean,
    omitting: Boolean,
    d3: Boolean
  },
  components: { "lone-pair-vue": LonePairVue },
  computed: {
    name(): string {
      return this.rgroup.payload.name;
    },
    abbrev(): string {
      return this.rgroup.payload.abbrev || this.name;
    },
    lonePairs(): LonePair[] {
      return this.rgroup.lonePairs;
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
    radius(): number {
      return this.rgroup.radius;
    },
    chargeText(): string {
      switch (this.charge) {
        case 0:
          return "";
        case 1:
          return "+";
        case -1:
          return "-";
        default:
          return this.charge > 0 ? `${this.charge}+` : `${-this.charge}-`;
      }
    },
    rootStyle(): string {
      return `
      visibility:${
        this.omitting && (this.omittable || this.softOmittable)
          ? "hidden"
          : "visible"
      };
      pointer-events:${this.transparent || this.omittable ? "none" : "all"};
      --x:${this.x}px;--y:${this.y}px;`;
    },
    classes(): string[] {
      const clazzes: string[] = [];
      if (this.transparent) {
        clazzes.push("transparent");
      }
      if (this.selected) {
        clazzes.push("selected");
      } else if (this.softOmittable) {
        clazzes.push("omittable");
        clazzes.push("soft");
        clazzes.push("override");
      } else if (this.omittable) {
        clazzes.push("omittable");
      }
      return clazzes;
    },
    color(): string {
      return getColor(this.rgroup);
    },
    softOmittable(): boolean {
      return this.rgroup.softOmittable;
    },
    omittable(): boolean {
      return this.rgroup.omittable;
    }
  },
  methods: {
    pointerDown(event: PointerEvent) {
      const rgroup = this.rgroup;
      this.$emit("dmouse", { target: "rgroup", payload: rgroup, event });
    },
    pointerUp(event: PointerEvent) {
      const rgroup = this.rgroup;
      this.$emit("umouse", { target: "rgroup", payload: rgroup, event });
    },
    pointerMove(event: PointerEvent) {
      const rgroup = this.rgroup;
      this.$emit("mmouse", { target: "rgroup", payload: rgroup, event });
    },
    cascadeDown(payload: {
      target: string;
      payload: any;
      event: PointerEvent;
    }) {
      this.$emit("dmouse", payload);
    },
    cascadeMove(payload: {
      target: string;
      payload: any;
      event: PointerEvent;
    }) {
      this.$emit("mmouse", payload);
    },
    cascadeUp(payload: { target: string; payload: any; event: PointerEvent }) {
      this.$emit("umouse", payload);
    }
  }
});
</script>
<style scoped>
::selection {
  background-color: transparent;
  color: inherit;
}
</style>
