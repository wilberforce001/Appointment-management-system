<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl mb-4">Welcome to the Appointment Management System</h1>
    <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
      <div class="flex flex-col">
        <label for="email" class="text-lg">Email:</label>
        <input type="email" id="email" v-model="email" required
               class="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:border-blue-500">
      </div>
      <div class="flex flex-col">
        <label for="password" class="text-lg">Password:</label>
        <input type="password" id="password" v-model="password" required
               class="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:border-blue-500">
      </div>
      <button type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
        Login
      </button>
    </form>
    <p class="mt-4">
      Not registered? <router-link to="/UserRegister" class="text-blue-500">Register here</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'UserHome',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });
        const data = await response.json();
        console.log('Login response data:', data);
        if (data.token) {
          console.log('User data:', data.user);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          this.$router.push('/AdminDashboard');
        } else {
          alert('Login failed: ' + (data.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred while logging in. Please try again.')
      }
    }
  }
};
</script>
