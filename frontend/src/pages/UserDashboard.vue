<template>
  <div class="p-4 bg-gray-100 min-h-screen">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">User Dashboard</h2>
    
    <!-- Create Appointment Form -->
    <form @submit.prevent="createAppointment" class="space-y-4 bg-white p-6 rounded-lg shadow-md mb-6">
      <input
        v-model="newAppointment.title"
        type="text"
        placeholder="Title"
        required
        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        v-model="newAppointment.description"
        type="text"
        placeholder="Description"
        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        v-model="newAppointment.date"
        type="date"
        placeholder="Date"
        required
        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Create Appointment
      </button>
    </form>

    <!-- Appointments List -->
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
      newAppointment: {
        title: '',
        description: '',
        date: '',
      },
      appointments: [],
    };
  },
  async created() {
    await this.fetchAppointments();
  },
  methods: {
    async createAppointment() {
      try {
        const token = localStorage.getItem('token');
        const response = await ApiService.createAppointment(this.newAppointment, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.appointments.push(response.data);
        // Clear form fields
        this.newAppointment = { title: '', description: '', date: '' };
      } catch (error) {
        console.error('Create appointment failed:', error.response ? error.response.data : error.message);
      }
    },
    async fetchAppointments() {
      try {
        const token = localStorage.getItem('token');
        const response = await ApiService.getAppointments({
          headers: { Authorization: `Bearer ${token}` },
        });
        this.appointments = response.data;
      } catch (error) {
        console.error('Fetch appointments failed:', error.response ? error.response.data : error.message);
      }
    },
  },
};
</script>
