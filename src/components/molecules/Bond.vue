<template>
    <svg>
        <line />
    </svg>
</template>
<script lang="ts">
import Vue from 'vue'
import {Bond, BondState} from "../../models";
export default Vue.extend({
    props: {
        bond:Bond
    }
})
</script>
