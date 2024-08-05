import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      user: null, // Initialize state properties as needed
    };
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    // Define actions if necessary
  },
  getters: {
    // Define getters if necessary
  },
});
