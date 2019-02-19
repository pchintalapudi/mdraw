<template>
  <rect :x="x" :y="y" :width="width" :height="height" class="selection-box"/>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  computed: {
    rawX(): number {
      return this.$store.state.molecules.pointerState.start.x;
    },
    rawY(): number {
      return this.$store.state.molecules.pointerState.start.y;
    },
    rawWidth(): number {
      return this.$store.state.molecules.pointerState.end.x - this.rawX;
    },
    rawHeight(): number {
      return this.$store.state.molecules.pointerState.end.y - this.rawY;
    },
    x(): number {
      return Math.min(this.rawX, this.rawWidth + this.rawX);
    },
    y(): number {
      return Math.min(this.rawY, this.rawHeight + this.rawY);
    },
    width(): number {
      return Math.abs(this.rawWidth);
    },
    height(): number {
      return Math.abs(this.rawHeight);
    }
  }
});
</script>
