<template>
  <div class="root">
    <button @click="startArrow(false)">
      <svg viewBox="-10 -10 20 20">
        <line x1="-10" y1="0" x2="0" y2="0" style="stroke:black;fill:transparent;"></line>
        <polygon points="0,3.5 0,-3.5 5,0"></polygon>
      </svg>
    </button>
    <button @click="startArrow(true)">Curved Arrow</button>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  methods: {
    startArrow(curved: boolean) {
      this.$emit("button-click", {
        target: curved ? "curved-arrow" : "straight-arrow",
        payload: undefined
      });
    }
  }
});
</script>
<style scoped>
.root {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
}
.root > button {
  height: 50%;
}
.root svg {
  height: 100%;
}
</style>
