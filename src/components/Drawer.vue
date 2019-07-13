<template>
  <div class="wrapper">
    <svg-vue :class="classes" :state-machine="stateMachine" id="svg">
      <molecule-vue :state-machine="stateMachine" :omit="omit" :d3="d3" id="molecules"></molecule-vue>
      <widget-vue :state-machine="stateMachine"></widget-vue>
    </svg-vue>
    <span v-if="!printing" class="touch-bar-spacer">
      <touchbar-vue :printing="printing" :state-machine="stateMachine" :d3="d3"></touchbar-vue>
    </span>
    <dialog-vue :state-machine="stateMachine"></dialog-vue>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { init_transforms } from "@/state_machine";
import { serialize, data, keyHandler, init_keybinds, Handler } from "@/utils";
import io from "@/io";
import MoleculeVue from "@/components/molecules/MoleculeView.vue";
import WidgetVue from "@/components/widgets/WidgetView.vue";
import TouchBarVue from "@/components/touchbar/TouchBar.vue";
import SVGVue from "@/components/SVGVue.vue";
import DialogVue from "@/components/dialogs/Dialog.vue";
export default Vue.extend({
  components: {
    "svg-vue": SVGVue,
    "molecule-vue": MoleculeVue,
    "widget-vue": WidgetVue,
    "touchbar-vue": TouchBarVue,
    "dialog-vue": DialogVue
  },
  created() {
    (this.$options as any).handlers = [];
  },
  data,
  watch: {
    lockout(next: boolean) {
      document.documentElement.classList.toggle("lockout", next);
    }
  },
  async mounted() {
    init_transforms();
    init_keybinds();
    if (this.lockout) {
      document.documentElement.classList.add("lockout");
    }
    try {
      const sessionread = await io.read("session", true);
      if (sessionread) {
        const sessiondata = JSON.parse(sessionread);
        Object.assign(this.$data, sessiondata);
      }
    } finally {
      this.lockout = false;
      (this.$options as any).handlers.push(
        [
          "keydown",
          (ev: KeyboardEvent) =>
            keyHandler(ev, this.$data as ReturnType<typeof data>)
        ] as Handler,
        ["resize", this.stateMachine.view.viewPort.listener] as Handler,
        [
          "beforeunload",
          (event: Event) => {
            io.write(
              "session",
              serialize(this.$data as ReturnType<typeof data>),
              true
            );
            if (false /*unsaved*/) {
              event.preventDefault();
              event.returnValue = true;
              return "stop pls";
            }
          }
        ] as Handler,
        ["beforeprint", () => (this.printing = true)] as Handler,
        ["afterprint", () => (this.printing = false)] as Handler
      );
      (this.$options as any).handlers.forEach((h: Handler) =>
        window.addEventListener(...h)
      );
    }
  },
  destroyed() {
    (this.$options as any).handlers.forEach((h: Handler) =>
      window.removeEventListener(...h)
    );
  },
  computed: {
    classes(): string[] {
      const clazzes = ["surface"];
      if (this.lockout) {
        clazzes.push("lockout");
      }
      return clazzes;
    }
  }
});
</script>
<style>
.touch-bar-spacer {
  position: fixed;
  max-height: 200px;
  height: 10vh;
  min-height: 2em;
  width: 100%;
  bottom: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}
.touch-bar-spacer > * {
  height: 100%;
  padding: 5px;
}
.surface {
  height: 100%;
  width: 100%;
}
.wrapper {
  height: 100%;
  width: 100%;
  display: flex;
}

.lockout {
  pointer-events: none;
  opacity: 0.5;
  cursor: wait;
}

html,
body {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}

.button,
.cancel-button {
  background-color: transparent;
  transition: background-color 200ms;
  padding: 5px 10px;
  border-radius: 5px;
  user-select: none;
  cursor: pointer;
}

.button:hover {
  background-color: #0088ff44;
}

.button:active {
  background-color: #0088ff88;
}

.cancel-button:hover {
  background-color: #ff220044;
}

.cancel-button:hover {
  background-color: #ff220088;
}

.transparent {
  pointer-events: none;
}
</style>
