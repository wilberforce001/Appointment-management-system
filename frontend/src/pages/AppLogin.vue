<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-xl">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Welcome to the Appointment Management System</h1>
      <h2 class="text-xl font-semibold text-gray-700 mb-4 text-center">Login</h2>
      <form v-if="!isLoggedIn" @submit.prevent="login" class="space-y-4">
        <input 
          v-model="email" 
          type="email" 
          placeholder="Email" 
          required 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <input 
          v-model="password" 
          type="password" 
          placeholder="Password" 
          required 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <button 
          type="submit" 
          class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 shadow-md"
        >
          Login
        </button>
      </form>
      <div class="flex flex-col space-y-4 mb-6 mt-4">
        <button @click="loginWithGoogle" class="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 shadow-md">
          Login with Google
        </button>
        <button @click="loginWithFacebook" class="w-full bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition duration-200 shadow-md">
          Login with Facebook
        </button>
      </div>
      <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
      <p class="mt-4 text-center text-gray-600">
        Don't have an account? 
        <router-link to="/register" class="text-blue-500 hover:underline">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
  name: 'AppLogin',
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

        // Store token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data

        // Set login state
        this.isLoggedIn = true;

        // Redirect based on the role
        if (response.data.role === 'admin') {
          this.$router.push('/AdminDashboard');
        } else {
          this.$router.push('/UserDashboard');
        }
      } catch (error) {
        console.error('Login failed', error);
        this.errorMessage = 'Login failed. Please check your email and password';
      }
    },
    loginWithGoogle() {
      window.location.href = 'http://localhost:5000/auth/google';
    },
    loginWithFacebook() {
      window.location.href = 'http://localhost:5000/auth/facebook';
    }
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
      this.isLoggedIn = !!localStorage.getItem('token');
    } else {
      localStorage.removeItem('user'); // Clear any potentially invalid user data
      this.isLoggedIn = false;
    }
  }
};
</script>



