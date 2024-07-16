<template>
    <div>
      <h2>Book an Appointment</h2>
      <form @submit.prevent="bookAppointment">
        <div>
          <label for="date">Date:</label>
          <input type="date" v-model="appointmentDate" required />
        </div>
        <div>
          <label for="time">Time:</label>
          <input type="time" v-model="appointmentTime" required />
        </div>
        <button type="submit">Book</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        appointmentDate: '',
        appointmentTime: '',
      };
    },
    methods: {
      bookAppointment() {
        // Send appointment data to the server
        const appointment = {
          date: this.appointmentDate,
          time: this.appointmentTime,
          userId: this.$store.state.user.id, // Assuming you have Vuex setup
        };
  
        this.$axios.post('/api/appointments', appointment)
          .then(response => {
            alert('Appointment booked successfully!');
            // Optionally, redirect or update UI
          })
          .catch(error => {
            console.error('Error booking appointment:', error);
          });
      },
    },
  };
  </script>
  