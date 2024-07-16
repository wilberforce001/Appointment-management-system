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
          <tr v-for="appointment in appointments" :key="appointment.id">
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
      fetchAppointments() {
        // Fetch appointments from the server
        this.$axios.get('/api/appointments')
          .then(response => {
            this.appointments = response.data;
          })
          .catch(error => {
            console.error('Error fetching appointments:', error);
          });
      },
      updateStatus(appointment, status) {
        // Update appointment status on the server
        this.$axios.put(`/api/appointments/${appointment.id}`, { status })
          .then(response => {
            appointment.status = status;
            alert('Appointment status updated successfully!');
          })
          .catch(error => {
            console.error('Error updating appointment status:', error);
          });
      },
    },
  };
  </script>
  