<template>
  <div class="dashboard bg-gray-100 min-h-screen py-8 px-4"> 
    <h1 class="text-2xl font-bold mb-4">Welcome, {{ userName }}!</h1> 
    <nav class="flex gap-4"> 
      <router-link class="test-blue-600 hover:underline" to="/UserProfile">Profile</router-link>
      <router-link class="text-blue-600 hover:underline" to="/ClientAppointments">Appointments</router-link>
      <router-link class="text-blue-600 hover:underline" to="/AppointmentCalendar">Calendar</router-link>
      <button @click="logout" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Logout</button> 
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      userName: '' // This should be fetched from the logged-in user's data
    };
  },
  methods: {
    fetchUserName() {
      //Fetch the user's name from the backend or local storage
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          console.log('Parsed user data:', parsedUser);
          if (parsedUser && parsedUser.username) {
            this.userName = parsedUser.username;
          } else {
            console.error('User data is missing the name property');
            this.$router.push('/');
          }
        } catch (e) {
          console.error('Failed to parse data:', e);
          this.$router.push('/');
        }
      } else {
        console.error('No user data found in localStorage');
        this.$router.push('/');
      }
    },
    logout() {
      // Clear user session data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/');
    }
  },
  created() {
    this.fetchUserName();
  }
};
</script>

<style scoped>
/* No need to add additional styles if using Tailwind classes directly */
</style>
