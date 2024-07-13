<template>
  <div>
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
  </div>
</template>
  
  <script>
  export default {
    name: 'UserRegister',
    data() {
      return {
        username: '',
        email: '',
        password: ''
      }
    },
    methods: {
      async handleRegister() {
        try {
          // Validate client-side input before making the request
          if (!this.username || !this.email || !this.password) {
            alert('Please fill in all fields');
            return;
          }
          const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: this.username,
              email: this.email,
              password: this.password
            })
          });
          const data = await response.json();

          if (!response.ok) {
            // Log the error response for debugging
            console.error('Error response:', data);
            alert('Registration failed: ' + (data.message || 'Unknown error'));
            return;
          }
          if (data.token) {
            localStorage.setItem('token', data.token);
            this.$router.push('/calendar');
          } else {
            alert('Registration failed');
          }
        } catch (error) {
          console.error('Error registering:', error);
        }
      }
    }
  }
  </script>
  