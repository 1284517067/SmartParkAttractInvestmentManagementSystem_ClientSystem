import Vue from "vue";
import Vuex from "vuex";
import vuexI18n from "vuex-i18n";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //token
    Authorization: localStorage.getItem("Authorization")
      ? localStorage.getItem("Authorization")
      : ""
  },
  mutations: {
    changeLogin(state, user) {
      state.Authorization = user.Authorization;
      localStorage.setItem("Authorization", user.Authorization);
    }
  },
  actions: {},
  modules: {}
});
