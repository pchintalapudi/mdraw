<template>
  <div class="error">
    <svg viewBox="-1.207 -1.207 2.414 3.5">
      <polygon
        points="0.5,-1.207 1.207,-0.5 1.207,0.5 0.5,1.207 -0.5,1.207 -1.207,0.5 -1.207,-0.5 -0.5,-1.207"
      ></polygon>
      <text fill="white" text-anchor="middle" dominant-baseline="middle" x="0" y="0.25">!</text>
    </svg>
    <p>This molecule cannot be saved on this browser :(</p>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>
<style>
.error {
  flex-flow: column nowrap;
}

.error > * > polygon {
  stroke: transparent;
  fill: red;
}

.error > * > text {
  font-size: 1.5pt;
}

.error > :last-child {
  color: white;
  font-size: 2em;
  margin-top: -2em;
  text-align: center;
}
</style>
