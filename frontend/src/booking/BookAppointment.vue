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
        <button type="submit">Book Appointment</button>
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
      async bookAppointment() {
        try {
          const response = await this.$http.post('/api/appointments', {
            date: this.appointmentDate,
            time: this.appointmentTime,
          });
          if (response.status === 201) {
            alert('Appointment booked successfully');
          } else {
            console.error('Unexpected response:', response);
          }
        } catch (error) {
          console.error('Error booking appointment:', error);
        }
      },
    },
  };
  </script>
  