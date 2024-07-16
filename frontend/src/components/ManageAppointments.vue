<template> 
    <div>
      <h2>Manage Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in appointments" :key="appointment._id">
            <td>{{ appointment.date }}</td> 
            <td>{{ appointment.time }}</td>
            <td>{{ appointment.customerName }}</td>
            <td>{{ appointment.status }}</td>
            <td>
              <button @click="updateStatus(appointment, 'confirmed')">Confirm</button>
              <button @click="updateStatus(appointment, 'cancelled')">Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        appointments: [],
      };
    },
    mounted() {
      this.fetchAppointments();
    },
    methods: {
      async fetchAppointments() {
        try {
          const response = await axios.get('/api/appointments');
          this.appointments = response.data;
        } catch (error) {
          console.error('Error fetching appointments:', error);
        }
      },
      async updateStatus(appointment, status) {
        try {
          await axios.put(`/api/appointments/${appointment._id}`, { status }); 
          appointment.status = status; // Update the status locally
        } catch (error) {
          console.error('Error updating appointment status:', error);
        }
      },
    },
  }; 
  </script>
  
  <style scoped>
  /* your styles here */
  </style>
  