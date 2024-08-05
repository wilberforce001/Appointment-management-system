<template>
    <div class="send-reminder">
      <h2>Send Reminder</h2>
      <form @submit.prevent="sendReminder">
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" required>
        </div>
        <div>
          <label for="message">Message:</label>
          <textarea v-model="message" required></textarea>
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  </template>
  
  <script>
  import ApiService from '../services/ApiService';
  
  export default {
    data() {
      return {
        email: '',
        message: '',
      };
    },
    methods: {
      async sendReminder() {
        const reminder = {
          email: this.email,
          message: this.message,
        };
        try {
          await ApiService.sendReminder(reminder);
          alert('Reminder sent successfully!');
        } catch (error) {
          alert('Failed to send reminder.');
          console.error(error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .send-reminder {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  </style>
  