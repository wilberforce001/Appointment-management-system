<template>
  <div class="dashboard bg-gray-100 min-h-screen py-8 px-4">
    <h1 class="text-2xl font-bold mb-4">Welcome, {{ userName }}!</h1>
    <nav class="flex gap-4">
      <router-link class="text-blue-600 hover:underline" to="/profile">Profile</router-link>
      <router-link class="text-blue-600 hover:underline" to="/appointments">Appointments</router-link>
      <router-link class="text-blue-600 hover:underline" to="/AppointmentCalendar">Calendar</router-link>
      <button @click="logout" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Logout</button>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
  data() {
    return {
      userName: "User's Name" // This should be fetched from the logged-in user's data
    };
  },
  methods: {
    logout() {
      // Implement logout functionality
      // Redirect to login page after logout
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/* No need to add additional styles if using Tailwind classes directly */
</style>
