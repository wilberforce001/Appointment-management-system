<template>
    <div>
      <h2>Scheduled Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in appointments" :key="appointment.id">
            <td>{{ appointment.customerName }}</td>
            <td>{{ appointment.date }}</td>
            <td>{{ appointment.time }}</td>
            <td>{{ appointment.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        appointments: [],
      };
    },
    async created() {
      try {
        const response = await this.$http.get('/api/appointments');
        this.appointments = response.data;
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    },
  };
  </script>
  