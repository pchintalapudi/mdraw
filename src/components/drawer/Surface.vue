<template>
  <svg>
    <rgroup-element v-for="rgroup in rgroups" :key="rgroup.id" :r-group="rgroup"></rgroup-element>
    <bond-element v-for="bond in bonds" :key="bond.id" :bond="bond"></bond-element>
  </svg>
</template>
<script lang="ts">
import Vue from "vue";
import { RGroup, Bond } from "../../models/";
import RGroupVue from "../molecules/RGroup.vue";
import BondVue from "../molecules/Bond.vue";
export default Vue.extend({
  components: {
    "rgroup-element": RGroupVue,
    "bond-element": BondVue
  },
  computed: {
    rgroups(): RGroup[] {
      return this.$store.state.molecules.rgroups;
    },
    bonds(): Bond[] {
      return this.$store.state.molecules.bonds;
    }
  },
  mounted() {
    this.$store.commit("molecules/setDrawPane", this.$el);
  }
});
</script>
