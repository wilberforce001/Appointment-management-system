<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Appointments</h2>

    <form @submit.prevent="createAppointment" class="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <input
        v-model="title"
        type="text"
        placeholder="Title"
        required
        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        v-model="description"
        type="text"
        placeholder="Description"
        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        v-model="date"
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

    <ul class="mt-6 space-y-2">
      <li
        v-for="appointment in appointments"
        :key="appointment._id"
        class="p-4 bg-white rounded-lg shadow-md hover:bg-gray-100"
      >
        <span class="font-medium text-gray-900">{{ appointment.title }}</span> - 
        <span class="text-gray-600">{{ appointment.date }}</span>
      </li>
    </ul>
  </div>
</template>
  
  <script>
  import ApiService from '../services/ApiService';
  
  export default {
    data() {
      return {
        title: '',
        description: '',
        date: '',
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
          const response = await ApiService.post('/appointments', {
            title: this.title,
            description: this.description,
            date: this.date,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.appointments.push(response.data);
        } catch (error) {
          console.error('Create appointment failed:', error.response.data);
        }
      },
      async fetchAppointments() {
        try {
          const token = localStorage.getItem('token');
          const response = await ApiService.get('/appointments', {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.appointments = response.data;
        } catch (error) {
          console.error('Fetch appointments failed:', error.response.data);
        }
      },
    },
  };
  </script>
  