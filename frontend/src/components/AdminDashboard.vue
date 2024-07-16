<template>
  <div class="dashboard bg-gray-100 min-h-screen flex">
    <!-- Sidebar -->
    <nav :class="['fixed top-0 left-0 h-screen bg-sky-200 shadow-md transition-transform duration-300 transform', {'-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen}]">
      <div class="p-4">
        <h1 class="text-xl font-bold mb-5 mt-20">Welcome, {{ userName }}!</h1>
        <ul class="space-y-6">
          <li>
            <router-link class="block text-blue-600 hover:underline" to="/UserProfile">Profile</router-link>
          </li>
          <li>
            <router-link class="block text-blue-600 hover:underline" to="/ClientAppointments">Appointments</router-link>
          </li>
          <li>
            <router-link class="block text-blue-600 hover:underline" to="/AppointmentCalendar">Calendar</router-link>
          </li>
          <li>
            <button @click="logout" class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Logout</button>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Toggle Button -->
    <button @click="toggleSidebar" class="fixed top-4 left-4 z-10 p-2 bg-gray-200 rounded-md">
      <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>

    <!-- Main Content -->
    <div class="flex-grow p-8 ml-16">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      userName: '', // This should be fetched from the logged-in user's data
      isSidebarOpen: false,
      activePage: ''
    };
  },
  methods: {
    fetchUserName() {
      // Fetch the user's name from the backend or local storage
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
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    setActivePage(page) {
      this.activePage = page;
      this.isSidebarOpen = true;
    }
  },
  created() {
    this.fetchUserName();
  }
};
</script>

<style scoped>
/* Sidebar Animation */
nav {
  transition: transform 0.3s ease;
}

.translate-x-0 {
  transform: translateX(0);
}

.-translate-x-full {
  transform: translateX(-100%);
}
</style>
