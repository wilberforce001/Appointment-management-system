<template>
  <div class="max-w-md mx-auto mt-8">
    <h2 class="text-2xl font-bold mb-4">User Profile</h2>
    <form @submit.prevent="updateProfile" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
        <input type="text" id="name" v-model="user.name" required
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>

      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input type="email" id="email" v-model="user.email" required
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>

      <div class="mb-6">
        <label for="phone" class="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
        <input type="text" id="phone" v-model="user.phone"
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>

      <div class="flex items-center justify-between">
        <button type="submit"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Update Profile
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { updateUserProfile } from '@/API/api'; 

export default {
  data() {
    return {
      user: {
        name: '',
        email: '',
        phone: ''
      }
    };
  },
  mounted() {
    // Fetch user data from backend API and populate this.user
    this.fetchUserData();
  },
  methods: {
    fetchUserData() {
      // Example fetch implementation
      // Replace with your actual API call to fetch user data
      this.user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890'
      };
    },
    updateProfile() {
      updateUserProfile(this.user)
        .then(response => {
          // Handle success, update UI if needed
          console.log('Profile updated successfully:', response.data);
        })
        .catch(error => {
          // Handle error, show error message to user
          console.error('Error updating profile:', error);
        });
    }
  }
};
</script>

<style scoped>
/* Add Tailwind CSS utility classes specific to this component */
</style>
