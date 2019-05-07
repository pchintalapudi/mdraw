<template>
  <div>
    <svg overflow="auto">
      <defs>
        <pattern id="patchy" width="5" height="10" patternUnits="userSpaceOnUse">
          <line stroke="black" stroke-width="4px" y2="10"></line>
        </pattern>
      </defs>
      <bond-view v-for="bond in bonds" :key="bond.id" :bond="bond"></bond-view>
      <rgroup-view v-for="rgroup in rgroups" :key="rgroup.id" :rgroup="rgroup"></rgroup-view>
    </svg>
    <span class="touch-bar"></span>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { StateMachine } from "../state_machine";
import { RGroup, Bond } from "../models";
import RGroupVue from "@/components/molecules/RGroup.vue";
import BondVue from "@/components/molecules/Bond.vue";
export default Vue.extend({
  components: { "bond-view": BondVue, "rgroup-vue": RGroupVue },
  data() {
    return {
      stateMachine: new StateMachine()
    };
  },
  computed: {
    rgroups(): RGroup[] {
      return this.stateMachine.stateVariables.rgroups;
    },
    bonds(): Bond[] {
      return this.stateMachine.stateVariables.bonds;
    }
  }
});
</script>
<style scoped>
.touch-bar {
  position: fixed;
  max-height: 200px;
  height: 10vh;
  min-height: 2em;
}
</style>
