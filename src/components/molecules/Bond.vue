<template>
  <svg>
    <line v-if="isSingleBond"></line>
    <svg v-if="isRecedingBond"></svg>
    <polygon v-if="isApproachingBond"></polygon>
    <svg v-if="bond.bondOrder == 2"></svg>
    <svg v-if="bond.bondOrder == 3"></svg>
  </svg>
</template>
<script lang="ts">
import Vue from "vue";
import { Bond, BondState } from "../../models";
export default Vue.extend({
  props: {
    bond: Bond
  },
  computed: {
    isSingleBond(): boolean {
      return this.bond.state == BondState.SINGLE_LINEAR;
    },
    isApproachingBond(): boolean {
      return this.bond.state == BondState.SINGLE_APPROACHING;
    },
    isRecedingBond(): boolean {
      return this.bond.state == BondState.SINGLE_RECEDING;
    }
  },
  methods: {}
});
</script>
