<template>
  <g
    @pointerdown.stop="pointerDown"
    @pointerup.stop="pointerUp"
    @pointermove.stop="pointerMove"
    :transform="`translate(${rgroup.x} ${rgroup.y})`"
  >
    <circle
      :r="d3 ? 12.5 : abbrev.length * 5 + 5"
      stroke-width="10"
      paint-order="stroke"
      :fill="d3 ? `url(#color${color}-gradient)` :  (omitting && rgroup.softOmittable && !selected) ? 'transparent' : 'white'"
      :stroke="selected ? '#0088ff44' : 'transparent'"
    />
    <title>{{rgroup.payload.name}}</title>
    <template v-if="selected || !(omitting && rgroup.softOmittable)">
      <text
        v-if="!d3"
        text-anchor="middle"
        dominant-baseline="central"
      >{{abbrev}}</text>
    </template>
    <text
      v-if="!d3 && rgroup.charge"
      :x="abbrev.length * 5 + 2.5"
      y="-5"
      font-size="small"
      text-anchor="start"
    >{{rgroup.charge === -1 ? '-' : rgroup.charge === 1 ? '+' : rgroup.charge > 0 ? rgroup.charge + "+" : rgroup.charge + "-"}}</text>
    <lone-pair-vue
      v-for="lp in rgroup.lonePairs"
      :key="lp.id"
      :lonepair="lp"
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
    selected: Boolean,
    omitting: Boolean,
    d3: Boolean
  },
  components: { "lone-pair-vue": LonePairVue },
  computed: {
    abbrev(): string {
      return this.rgroup.payload.abbrev || this.rgroup.payload.name;
    },
    rootStyle(): string {
      return `--x:${this.rgroup.x}px;--y:${this.rgroup.y}px;`;
    },
    color(): string {
      return getColor(this.rgroup);
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
