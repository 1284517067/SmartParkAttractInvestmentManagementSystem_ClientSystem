import Vue from "vue";
import axios from "axios";
import Vuex from "vuex";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import qs from "qs";
import "./assets/scss/index.scss";
import "./assets/index.css";

Vue.prototype.$qs = qs;
Vue.prototype.$axios = axios;
Vue.use(Vuex);

Vue.config.productionTip = false;
axios.defaults.withCredentials = true;
Vue.prototype.HOST = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
