<template>
  <div class="dashboard">
    <h2>Appointment Dashboard</h2>
    <div v-for="appointment in appointments" :key="appointment.id" class="appointment">
      <p>{{ appointment.date }} - {{ appointment.time }}</p>
      <p>{{ appointment.customer }}</p>
      <p>Status: {{ appointment.status }}</p>
      <button @click="updateStatus(appointment.id, 'confirmed')">Confirm</button>
      <button @click="updateStatus(appointment.id, 'cancelled')">Cancel</button>
    </div>
  </div>
</template> 

<script>
export default {
  data() {
    return {
      appointments: []
    };
  },
  async mounted() {
    await this.fetchAppointments();
  },
  methods: {
    async fetchAppointments() {
      try {
        const response = await fetch('http://localhost:5000/appointments');
        const data = await response.json();
        this.appointments = data;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async updateStatus(id, status) {
      try {
        const response = await fetch(`http://localhost:5000/appointments/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        });
        const data = await response.json();
        if (data.success) {
          await this.fetchAppointments(); // Refresh the list
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
};   
</script>

<style scoped>
/* Add any custom styles here */
</style>
