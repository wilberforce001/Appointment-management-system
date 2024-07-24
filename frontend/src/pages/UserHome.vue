<!-- Home.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white p-8 rounded shadow-lg">
      <h1 class="text-2xl font-bold mb-6 text-center">Welcome to the Appointment Management System</h1> 
      <h1 class="text-xl font-semibold mb-4">Login</h1>
      <form @submit.prevent="login" class="space-y-4"> 
        <input 
          v-model="email" 
          type="email" 
          placeholder="Email" 
          required 
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          v-model="password" 
          type="password" 
          placeholder="Password" 
          required 
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button> 
      </form>
      <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
      <p class="mt-4 text-center">
        Don't have an account? 
        <router-link to="/UserRegister" class="text-blue-500 hover:underline">Register here</router-link>
      </p>
    </div>
  </div>
</template>
  
  <script>
  import ApiService from '../services/ApiService';

  export default {
    name: 'UserHome',
    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
        };
    },
    methods: {
        async login() {
            try  {
            const response = await ApiService.loginUser({ email: this.email, password: this.password });
            console.log('Login successful', response.data); 
            // Save the token and redirect to the dashboard or another page
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            this.$router.push(response.data.role === 'admin' ? '/admin-dashboard' : '/UserDashboard');
            } catch (error) {
                console.error('Login failed', error);
                this.errorMessage ='Login failed. Please check your email and password'
        }
      },
    },
  };
  </script>
  
  
  