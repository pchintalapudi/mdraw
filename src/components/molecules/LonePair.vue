<template>
  <g
    :style="`--x:${lonepair.radius}px;--angle:${lonepair.angle}deg;--tx:${-lonepair.radius}px;--ty:0px`"
    @pointerdown.stop="mouseDown"
    @pointermove.stop="mouseMove"
    @pointerup.stop="mouseUp"
    class="positioned"
  >
    <circle r="5" fill="transparent"></circle>
    <circle v-if="lonepair.count === 1" cx="0" cy="0" r="2" style="pointer-events:none"></circle>
    <template v-else>
      <circle cx="0" cy="-3" r="2" fill="black" style="pointer-events:none"></circle>
      <circle cx="0" cy="3" r="2" fill="black" style="pointer-events:none"></circle>
    </template>
  </g>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { LonePair, RGroup } from "@/models";
export default Vue.extend({
  props: {
    lonepair: Object as PropType<LonePair>
  },
  methods: {
    mouseDown(event: PointerEvent) {
      this.$emit("cascade-down", {
        target: "lone-pair",
        payload: this.lonepair,
        event
      });
    },
    mouseMove(event: PointerEvent) {
      this.$emit("cascade-move", {
        target: "lone-pair",
        payload: this.lonepair,
        event
      });
    },
    mouseUp(event: PointerEvent) {
      this.$emit("cascade-up", {
        target: "lone-pair",
        payload: this.lonepair,
        event
      });
    }
  }
});
</script>