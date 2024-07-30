import { createStore } from 'vuex';

const store = createStore({
  state: {
    isAuthenticated: !!localStorage.getItem('token'), 
    user: JSON.parse(localStorage.getItem('user')) || null
  },
  mutations: {
    setAuthentication(state, payload) {
      state.isAuthenticated = payload.isAuthenticated;
      state.user = payload.user;
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  actions: {
    login({ commit }, user) {
      commit('setAuthentication', { isAuthenticated: true, user });
    },
    logout({ commit }) {
      commit('logout');
    }
  }
});

export default store;
