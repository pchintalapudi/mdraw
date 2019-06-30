<template>
  <transition name="fade">
    <div v-if="openDialog" class="root" @pointerdown.stop="pointerDown" @pointerup.stop="pointerUp">
      <component
        :is="openDialog"
        :pointer-up="triggered"
        :state-machine="stateMachine"
        @stop-cancel="stopCancel"
      ></component>
    </div>
  </transition>
</template>
<script lang="ts">
import Vue from "vue";
import { State, Action, StateMachine } from "@/state_machine";
import MinimapVue from "@/components/dialogs/Minimap.vue";
export default Vue.extend({
  components: { "mapping-vue": MinimapVue },
  props: { stateMachine: StateMachine },
  data() {
    return { mouseDown: false, triggered: false };
  },
  computed: {
    openDialog(): string {
      switch (this.stateMachine.state) {
        default:
          return "";
        case State.MAPPING:
          return "mapping-vue";
      }
    }
  },
  methods: {
    pointerDown() {
      this.mouseDown = true;
    },
    pointerUp() {
      if (this.mouseDown) {
        this.cancel();
      } else {
        this.triggered = !this.triggered;
      }
    },
    stopCancel() {
      this.mouseDown = false;
    },
    cancel() {
      this.stateMachine.execute(Action.CANCEL, undefined as any);
    }
  }
});
</script>
<style scoped>
.root {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #00000044;
  display: flex;
  justify-content: center;
  align-items: center;
}
.root > * {
  transition: opacity;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
