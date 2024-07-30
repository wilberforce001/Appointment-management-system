<template>
  <nav class="flex justify-around bg-gray-800 p-4 text-white"> 
    <router-link to="/login" v-if="!isLoggedIn" class="hover:underline">Login</router-link> 
    <router-link to="/register" v-if="!isLoggedIn" class="hover:underline">Register</router-link>
    <router-link to="/AdminDashboard" v-if="isLoggedIn && isAdmin" class="hover:underline">Admin Dashboard</router-link> 
    <router-link to="/UserDashboard" v-if="isLoggedIn && isUser" class="hover:underline">User Dashboard</router-link>
    <router-link to="/AppointmentCalendar" v-if="isLoggedIn" class="hover:underline">Calendar</router-link>
    <router-link to="/BookAppointment" v-if="isLoggedIn" class="hover:underline">Book Appointment</router-link>
    <router-link to="/ScheduledAppointments" v-if="isLoggedIn" class="hover:underline">Scheduled Appointments</router-link>
    <button @click="logout" v-if="isLoggedIn" class="hover:underline">Logout</button>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default { 
  setup() {
    const router = useRouter();
    const isLoggedIn = ref(false);
    const isAdmin = ref(false);
    const isUser = ref(false);

    const updateAuthState = () => {
      isLoggedIn.value = !!localStorage.getItem('token');
      isAdmin.value = localStorage.getItem('role') === 'admin';
      isUser.value = localStorage.getItem('role') === 'user';
      console.log(`isLoggedIn: ${isLoggedIn.value}, isAdmin: ${isAdmin.value}, isUser: ${isUser.value}`);
    };

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      updateAuthState();
      router.push('/login');
    };

    onMounted(() => {
      updateAuthState();
    });

    return {
      isLoggedIn,
      isAdmin,
      isUser,
      logout,
    };
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
