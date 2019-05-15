<template>
  <form name="lone-group-creator" class="lone-group-creator">
    <button @click="spawn(2)" type="button">
        <svg viewBox="-10 -10 20 20">
            <circle cx="-3" cy="-3" r="2.5"></circle>
            <circle cx="3" cy="3" r="2.5"></circle>
        </svg>
    </button>
    <button @click="spawn(1)" type="button">
        <svg viewBox="-10 -10 20 20">
            <circle cx="0" cy="0" r="2.5"></circle>
        </svg>
    </button>
  </form>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  methods: {
    spawn(count: number) {
      this.$emit("button-click", { target: "lone-pair", payload: count });
    }
  }
});
</script>
<style scoped>
.lone-group-creator {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
}
.lone-group-creator>button {
  height: 50%;
}
.lone-group-creator svg {
  height: 100%;
}
</style>
