<template>
  <div class="p-4 bg-gray-100 min-h-screen">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">User Dashboard</h2>
    <h3 class="text-xl font-semibold mb-2 text-gray-700">Appointments</h3>
    <ul class="list-disc pl-5 space-y-2">
      <li
        v-for="appointment in appointments"
        :key="appointment._id"
        class="p-2 bg-white rounded shadow-md hover:bg-gray-50"
      >
        <span class="font-medium text-gray-900">{{ appointment.title }}</span> - 
        <span class="text-gray-600">{{ appointment.date }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import ApiService from '../services/ApiService.js';

export default {
  data() {
    return {
      appointments: [],
    };
  },
  async created() {
    await this.fetchAppointments();
  },
  methods: {
    async fetchAppointments() {
      try {
        const token = localStorage.getItem('token');
        const response = await ApiService.getAppointments({
          headers: { Authorization: `Bearer ${token}` },
        }); 
        this.appointments = response.data; // Ensure you assign the correct data
      } catch (error) {
        console.error('Fetch appointments failed:', error.response ? error.response.data : error.message);
      }
    },
  },
};
</script>
