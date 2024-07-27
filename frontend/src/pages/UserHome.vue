<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white p-8 rounded shadow-lg">
      <h1 class="text-2xl font-bold mb-6 text-center">
        Welcome to the Appointment Management System
      </h1>

      <!-- Login Form -->
      <form v-if="!isLoggedIn" @submit.prevent="login" class="space-y-4">
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

      <!-- Social Login Buttons -->
      <div class="flex flex-col space-y-4 mb-6">
        <button @click="loginWithGoogle" class="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Login with Google
        </button>
      </div>
      <div class="flex flex-col space-y-4 mb-6">
        <button @click="loginWithFacebook" class="w-full bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600">
          Login with Facebook
        </button>
      </div>
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
      isLoggedIn: false,
    };
  },
  methods: {
    async login() {
      try {
        const response = await ApiService.loginUser({ email: this.email, password: this.password });
        console.log('Login successful', response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        this.isLoggedIn = true; // Update login status
        this.$router.push(response.data.role === 'admin' ? '/AdminDashboard' : '/UserDashboard');
      } catch (error) {
        console.error('Login failed', error);
        this.errorMessage = 'Login failed. Please check your email and password';
      }
    },
    loginWithGoogle() {
      window.location.href = 'http://localhost:5000/auth/google'; 
    },
    loginWithFacebook() {
      window.location.href = 'http://localhost:5000/auth/google';
    }
  },
  mounted() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }
};
</script>