import VueChatter from "@/components/VueChatter";

const plugin = {
  install(Vue) {
    Vue.component(VueChatter.name, VueChatter);
  },
};

VueChatter.install = plugin.install;

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;

if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(VueChatter);
}

export default VueChatter;
