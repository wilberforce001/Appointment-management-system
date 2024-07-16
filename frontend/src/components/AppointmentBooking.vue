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
  import axios from 'axios'; // Import axios here
  
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
          await axios.post('/api/appointments', {
            service: 'Your service here', // Replace with actual service data
            date: this.appointmentDate,
            time: this.appointmentTime,
          });
          alert('Appointment booked successfully!');
        } catch (error) {
          console.error('Error booking appointment:', error);
          alert('Failed to book appointment. Please try again.');
        }
      },
    },
  };
  </script>
  