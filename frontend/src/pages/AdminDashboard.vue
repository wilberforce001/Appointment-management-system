<template>
    <div class="p-4 bg-gray-100 min-h-screen">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Admin Dashboard</h2>
      
      <!-- Manage Available Time Slots -->
      <div class="mb-6">
        <h3 class="text-xl font-semibold mb-2 text-gray-700">Manage Time Slots</h3>
        <form @submit.prevent="addTimeSlot" class="space-y-4">
          <div>
            <label class="block text-gray-600">Date:</label>
            <input v-model="newTimeSlot.date" type="date" class="p-2 border rounded w-full"/>
          </div>
          <div>
            <label class="block text-gray-600">Start Time:</label>
            <input v-model="newTimeSlot.startTime" type="time" class="p-2 border rounded w-full"/>
          </div>
          <div>
            <label class="block text-gray-600">End Time:</label>
            <input v-model="newTimeSlot.endTime" type="time" class="p-2 border rounded w-full"/>
          </div>
          <button type="submit" class="bg-blue-500 text-white p-2 rounded">Add Time Slot</button>
        </form>
      </div>
  
      <!-- View Appointments -->
      <div>
        <h3 class="text-xl font-semibold mb-2 text-gray-700">Upcoming Appointments</h3>
        <ul class="list-disc pl-5 space-y-2">
          <li
            v-for="appointment in appointments"
            :key="appointment._id"
            class="p-2 bg-white rounded shadow-md hover:bg-gray-50"
          >
            <span class="font-medium text-gray-900">{{ appointment.title }}</span> - 
            <span class="text-gray-600">{{ appointment.date }}</span>
            <button @click="changeStatus(appointment._id, 'confirmed')" class="ml-2 text-blue-600">Confirm</button>
            <button @click="changeStatus(appointment._id, 'canceled')" class="ml-2 text-red-600">Cancel</button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import ApiService from '../services/ApiService.js';
  
  export default {
    data() {
      return {
        appointments: [],
        newTimeSlot: {
          date: '',
          startTime: '',
          endTime: '',
        },
      };
    },
    async created() {
      await this.fetchAppointments();
    },
    methods: {
      async fetchAppointments() {
        try {
          const response = await ApiService.getAppointments();
          this.appointments = response.data;
        } catch (error) {
          console.error('Fetch appointments failed:', error.response ? error.response.data : error.message);
        }
      },
      async addTimeSlot() {
        try {
          const response = await ApiService.addTimeSlot(this.newTimeSlot);
          if (response.status === 201) {
            this.newTimeSlot = { date: '', startTime: '', endTime: '' }; // Reset form
          }
        } catch (error) {
          console.error('Add time slot failed:', error.response ? error.response.data : error.message);
        }
      },
      async changeStatus(appointmentId, status) {
        try {
          const response = await ApiService.updateAppointmentStatus(appointmentId, { status });
          if (response.status === 200) {
            await this.fetchAppointments(); // Refresh appointments list
          }
        } catch (error) {
          console.error('Update appointment status failed:', error.response ? error.response.data : error.message);
        }
      },
    }, 
  };
  </script>
  