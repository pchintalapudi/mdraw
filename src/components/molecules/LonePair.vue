<template>
  <g
    :style="`visibility:visible;--x:${tx}px;--angle:${angle}deg;--tx:${-tx}px;--ty:0px`"
    @pointerdown.stop="mouseDown"
    @pointermove.stop="mouseMove"
    @pointerup.stop="mouseUp"
    class="positioned"
  >
    <circle r="5" fill="transparent"></circle>
    <circle v-if="count === 1" cx="0" cy="0" r="2" style="pointer-events:none"></circle>
    <template v-else>
      <circle cx="0" cy="-3" r="2" fill="black" style="pointer-events:none"></circle>
      <circle cx="0" cy="3" r="2" fill="black" style="pointer-events:none"></circle>
    </template>
  </g>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { LonePair, RGroup } from "../../models";
export default Vue.extend({
  props: {
    lonepair: Object as PropType<LonePair>,
    omitting: Boolean
  },
  computed: {
    count(): number {
      return this.lonepair.count;
    },
    angle(): number {
      return this.lonepair.angle;
    },
    tx(): number {
      return this.lonepair.radius;
    }
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