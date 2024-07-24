<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white p-8 rounded shadow-lg">
      <h1 class="text-xl font-semibold mb-4">Register</h1>
      <form @submit.prevent="register" class="space-y-4">
        <input 
          v-model="firstName" 
          type="text" 
          placeholder="First Name" 
          required 
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          v-model="secondName" 
          type="text" 
          placeholder="Second Name" 
          required 
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
        <select v-model="role" required class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button 
          type="submit" 
          class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
      <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
      <p class="mt-4 text-center">
        Already have an account? 
        <router-link to="/login" class="text-blue-500 hover:underline">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
  name: 'UserRegister',
  data() {
    return {
      firstName: '',
      secondName: '',
      email: '',
      password: '',
      role: 'user', // Default role to user
      errorMessage: '',
    };
  },
  methods: {
    async register() {
      try {
        const response = await ApiService.registerUser({
          firstName: this.firstName,
          secondName: this.secondName,
          email: this.email,
          password: this.password,
          role: this.role, // Include the role in the registration data
        });
        console.log('Registration successful', response.data);
        this.$router.push('/login');
      } catch (error) {
        console.error('Registration failed', error);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    },
  },
};
</script>
