<template>
  <nav class="flex justify-around bg-gray-800 p-4 text-white">
    <router-link to="/login" v-if="!isLoggedIn" class="hover:underline">Login</router-link>
    <router-link to="/UserRegister" v-if="!isLoggedIn" class="hover:underline">Register</router-link>
    <router-link to="/AdminDashboard" v-if="isLoggedIn && isAdmin" class="hover:underline">Admin Dashboard</router-link>
    <router-link to="/UserDashboard" v-if="isLoggedIn && isUser" class="hover:underline">User Dashboard</router-link>
    <router-link to="/AppointmentCalendar" v-if="isLoggedIn" class="hover:underline">Calendar</router-link>
    <button @click="logout" v-if="isLoggedIn" class="hover:underline">Logout</button>
  </nav>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    },
    isAdmin() {
      return localStorage.getItem('role') === 'admin';
    },
    isUser() {
      return localStorage.getItem('role') === 'user';
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
nav a {
  color: white;
  margin: 0 10px;
}
nav a:hover {
  text-decoration: underline;
}
</style>
