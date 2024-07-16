<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Appointments Page</h2>

    <!-- Display Appointment List -->
    <div v-if="appointments.length > 0" class="mb-8">
      <h3 class="text-xl font-semibold mb-2">Your Appointments:</h3>
      <ul class="space-y-4">
        <li v-for="appointment in appointments" :key="appointment._id" class="p-4 border rounded-lg shadow">
          <div class="mb-2">
            <strong class="block">Date:</strong> {{ appointment.date }} <br>
            <strong class="block">Time:</strong> {{ appointment.time }} <br>
            <strong class="block">Service:</strong> {{ appointment.service }} <br>
          </div>
          <div class="space-x-2">
            <button @click="editAppointment(appointment)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
              Edit
            </button>
            <button @click="cancelAppointment(appointment)" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
              Cancel
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Show message if no appointments -->
    <div v-else class="mb-8">
      <p class="text-gray-500">No appointments scheduled.</p>
    </div>

    <!-- Appointment Booking Form -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4">Book Appointment:</h3>
      <form @submit.prevent="bookAppointment" class="space-y-4">
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700">Date:</label>
          <input type="date" id="date" v-model="newAppointment.date" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        </div>
        <div>
          <label for="time" class="block text-sm font-medium text-gray-700">Time:</label>
          <input type="time" id="time" v-model="newAppointment.time" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        </div>
        <!-- Additional fields for services if applicable -->
        <!--
        <div>
          <label for="service" class="block text-sm font-medium text-gray-700">Service:</label>
          <select id="service" v-model="newAppointment.service" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="service1">Service 1</option>
            <option value="service2">Service 2</option>
          </select>
        </div>
        -->
        <button type="submit" class="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
          Book Appointment
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientAppointments',
  data() {
    return {
      appointments: [], // Initialize with empty array
      newAppointment: {
        date: '',
        time: '',
        service: '' // Add more fields as needed
      }
    };
  },
  methods: {
    // Method to fetch appointments when component is mounted
    async fetchAppointments() {
      try {
        // Replace with actual API call to fetch appointments for the logged-in user
        const response = await fetch('/api/appointments'); // Adjust endpoint as per your backend setup
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const appointmentsData = await response.json();
        this.appointments = appointmentsData.appointments;
      } catch (error) {
        console.error('Error fetching appointments:', error.message);
        // Handle error gracefully, e.g., show a message to the user
      }
    },

    // Method to book a new appointment
    async bookAppointment() {
      try {
        // Replace with actual API call to send new appointment data to backend
        const response = await fetch('/api/appointments/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newAppointment)
        });
        if (!response.ok) {
          throw new Error('Failed to book appointment');
        }
        // Clear form fields after successful booking
        this.newAppointment.date = '';
        this.newAppointment.time = '';
        this.newAppointment.service = ''; // Reset as needed

        // Optionally, fetch updated list of appointments after booking
        this.fetchAppointments();
      } catch (error) {
        console.error('Error booking appointment:', error.message);
        // Handle error gracefully, e.g., show a message to the user
      }
    },

    // Method to edit an existing appointment
    editAppointment(appointment) {
      // Implement edit functionality based on your requirements
      console.log('Edit appointment:', appointment);
      // Example: Redirect to edit form or modal
    },

    // Method to cancel an existing appointment
    async cancelAppointment(appointment) {
      try {
        // Replace with actual API call to cancel appointment on backend
        const response = await fetch(`/api/appointments/${appointment._id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to cancel appointment');
        }
        // Remove canceled appointment from local list
        this.appointments = this.appointments.filter(appt => appt._id !== appointment._id);
      } catch (error) {
        console.error('Error canceling appointment:', error.message);
        // Handle error gracefully, e.g., show a message to the user
      }
    }
  },
  mounted() {
    // Fetch appointments when component is mounted
    this.fetchAppointments();
  }
};
</script>

<style scoped>
/* Add scoped styles as needed */
</style>
