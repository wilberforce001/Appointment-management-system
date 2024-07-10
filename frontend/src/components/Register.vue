<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6">Register</h1>
        <form @submit.prevent="handleRegister">
          <div class="mb-4">
            <label class="block text-gray-700">Username</label>
            <input type="text" v-model="username" class="w-full p-2 border border-gray-300 rounded mt-1"/>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Email</label>
            <input type="email" v-model="email" class="w-full p-2 border border-gray-300 rounded mt-1"/>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Password</label>
            <input type="password" v-model="password" class="w-full p-2 border border-gray-300 rounded mt-1"/>
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded mt-4">Register</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: ''
      }
    },
    methods: {
      handleRegister() {
        // Handle register logic
      }
    }
  }
  </script>
  