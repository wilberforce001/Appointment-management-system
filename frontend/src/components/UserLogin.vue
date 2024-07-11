<template> 
  <div>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h1 class="text-2xl font-bold mb-6">Login</h1>
            <form @submit.prevent="handleLogin">
                <div class="mb-4">
                    <label class="block text-gray-700">Email</label>
                    <input type="email" v-model="email" class="w-full p-2 border border-gray-300 rounded mt-1"/>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700">Password</label>
                    <input type="password" v-model="password" class="w-full p-2 border border-gray-300 rounded mt-1">
                </div>
                <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded mt-4">Login</button>
            </form>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: ''
    }
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
        if (data.token) {
          localStorage.setItem('token', data.token);
          this.$router.push('/calendar');
        } else {
          alert('Login failed');
        }
      } catch (error) {
        console.error('Error logging in:', error);
      }
    }
  }
}
</script>