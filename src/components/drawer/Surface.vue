<template>
  <svg>
    <rgroup-element v-for="rgroup in rgroups" :key="rgroup.id" :r-group="rgroup"></rgroup-element>
    <rgroup-element v-for="rgroup in selected" :key="rgroup.id" :r-group="rgroup"></rgroup-element>
  </svg>
</template>
<script lang="ts">
import Vue from "vue";
import { RGroup, Bond } from "../../models/";
import RGroupVue from "../molecules/RGroup.vue";
import BondVue from "../molecules/Bond.vue";
export default Vue.extend({
  components: {
    "rgroup-element": RGroupVue
  },
  computed: {
    rgroups(): RGroup[] {
      return this.$store.state.molecules.rgroups;
    },
    selected(): RGroup[] {
      return this.$store.state.molecules.selected;
    },
    bonds(): Bond[] {
      return this.$store.state.molecules.bonds;
    }
  }
});
</script>
