<template>
  <nav class="flex justify-around bg-gray-800 p-4 text-white">
    <router-link to="/login" v-if="!isLoggedIn" class="hover:underline">Login</router-link> 
    <router-link to="/UserRegister" v-if="!isLoggedIn" class="hover:underline">Register</router-link>
    <router-link to="/AdminDashboard" v-if="isLoggedIn && isAdmin" class="hover:underline">Dashboard</router-link>
    <router-link to="/UserDashboard" v-if="isLoggedIn && isUser" class="hover:underline">Dashboard</router-link>
    <router-link to="/AppointmentCalendar" v-if="isLoggedIn" class="hover:underline">Calendar</router-link>
    <router-link to="/BookAppointment" v-if="isLoggedIn" class="hover:underline">Book Appointment</router-link>
    <router-link to="/ScheduledAppointments" v-if="isLoggedIn" class="hover:underline">Schedule Appointment</router-link>
    <button @click="logout" v-if="isLoggedIn" class="hover:underline">Logout</button>
  </nav>
</template>

<script> 
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const isLoggedIn = ref(!!localStorage.getItem('token'));
    const isAdmin = computed(() => localStorage.getItem('role') === 'admin');
    const isUser = computed(() => localStorage.getItem('role') === 'user');

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      isLoggedIn.value = false;
      router.push('/login');
    };

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
