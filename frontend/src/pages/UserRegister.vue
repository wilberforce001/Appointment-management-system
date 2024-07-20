<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white p-8 rounded shadow-lg">
      <h1 class="text-2xl font-bold mb-6 text-center">Register</h1>
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
        <button 
          type="submit" 
          class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Register
        </button> 
      </form>
      <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
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
          });
          console.log('Registration successful', response.data); 
          // Redirect to login or another page
          this.$router.push('/login');
        } catch (error) {
          console.error('Registration failed', error);
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
    },
  };
  </script>
