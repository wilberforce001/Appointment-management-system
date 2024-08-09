<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 px-4">
    <h1 :class="{'drop-animation': messageVisible, 'drop-in': !messageVisible}" class="text-center text-4xl md:text-5xl font-bold text-white mb-8">
      Welcome to Appointment Management System
    </h1>
    <div class="space-x-4">
      <router-link to="/login" class="px-4 py-2 bg-white text-blue-500 rounded shadow hover:bg-gray-100 transition duration-200">
        Login
      </router-link>
      <router-link to="/register" class="px-4 py-2 bg-white text-blue-500 rounded shadow hover:bg-gray-100 transition duration-200">
        Register
      </router-link>
    </div>
    <router-view class="mt-8"></router-view>
  </div>
</template>

<script>
export default {
  name: 'UserHome',
  data() {
    return {
      messageVisible: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.messageVisible = true;
    }, 1000); 
  }
}
</script>

<style scoped>
.drop-animation {
  transform: translateY(0); 
  opacity: 1;
  transition: transform 1s ease-out, opacity 1s ease-out;
}

.drop-in {
  transform: translateY(-400px); /* End in the original position */
  opacity: 0;
}
</style>
