<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <transition name="slide">
      <div v-if="showSidebar" class="sidebar bg-gray-800 text-white p-4 w-64 fixed left-0 top-0 bottom-0 shadow-md z-50">
        <h2 class="text-xl font-bold mb-4">Appointments</h2>
        <ul class="space-y-2">
          <li
            v-for="appointment in appointments"
            :key="appointment._id"
            class="p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
            @click="selectAppointment(appointment)"
          >
            <span class="font-medium">{{ appointment.title }}</span> - 
            <span class="text-gray-300">{{ appointment.date }}</span>
          </li>
        </ul>
      </div>
    </transition>

    <!-- Main Content -->
    <div :class="{'ml-64': showSidebar, 'ml-0': !showSidebar}" class="flex-1 p-4 transition-all duration-300 ease-in-out max-w-2xl">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <button @click="toggleSidebar" class="bg-blue-500 text-white p-2 rounded">
          {{ showSidebar ? 'Hide Appointments' : 'Show Appointments' }}
        </button>
      </div>

      <!-- Manage Available Time Slots -->
      <div class="mb-6">
        <h3 class="text-xl font-semibold mb-2 text-gray-700">Manage Time Slots</h3>
        <form @submit.prevent="addTimeSlot" class="space-y-4">
          <div>
            <label class="block text-gray-600">Title:</label>
            <input v-model="newTimeSlot.title" type="text" class="p-2 border rounded w-full" />
          </div>
          <div>
            <label class="block text-gray-600">Description:</label>
            <input v-model="newTimeSlot.description" type="text" class="p-2 border rounded w-full" />
          </div>
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
        <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
      </div>

      <!-- View Selected Appointment -->
      <div v-if="selectedAppointment" class="mt-6">
        <h3 class="text-xl font-semibold mb-2 text-gray-700">Selected Appointment</h3>
        <div class="p-4 bg-gray-50 rounded shadow-inner">
          <p><strong>Title:</strong> {{ selectedAppointment.title }}</p>
          <p><strong>Description:</strong> {{ selectedAppointment.description }}</p>
          <p><strong>Date:</strong> {{ selectedAppointment.date }}</p>
          <p><strong>Status:</strong> {{ selectedAppointment.status }}</p>
          <button @click="changeStatus(selectedAppointment._id, 'confirmed')" class="mt-2 bg-green-500 text-white p-2 rounded">Confirm</button>
          <button @click="changeStatus(selectedAppointment._id, 'canceled')" class="mt-2 bg-red-500 text-white p-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService.js';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      appointments: [],
      newTimeSlot: {
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
      },
      errorMessage: '',
      selectedAppointment: null,
      showSidebar: false,
    };
  },
  async created() {
    await this.fetchAppointments();
  },
  methods: {
    async fetchAppointments() {
      try {
        const response = await ApiService.getAppointments({
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.appointments = response.data;
      } catch (error) {
        console.error('Fetch appointments failed:', error.response ? error.response.data : error.message);
        this.errorMessage = 'Failed to fetch appointments. Please try again.';
      }
    },
    async addTimeSlot() {
      try {
        const response = await ApiService.createAppointment(this.newTimeSlot, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.status === 201) {
          this.newTimeSlot = { title: '', description: '', date: '', startTime: '', endTime: '' }; // Reset form
          await this.fetchAppointments(); // Refresh appointments list
        }
      } catch (error) {
        console.error('Add time slot failed:', error.response ? error.response.data : error.message);
        this.errorMessage = 'Failed to add time slot. Please try again.';
      }
    },
    async changeStatus(appointmentId, status) {
      try {
        const response = await ApiService.updateAppointmentStatus(appointmentId, status, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.status === 200) {
          await this.fetchAppointments(); // Refresh appointments list
          this.selectedAppointment = null; // Deselect appointment
        }
      } catch (error) {
        console.error('Update appointment status failed:', error.response ? error.response.data : error.message);
        this.errorMessage = 'Failed to update appointment status. Please try again.';
      }
    },
    selectAppointment(appointment) {
      this.selectedAppointment = appointment;
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 16rem; /* Fixed width for the sidebar */
  background-color: #2d3748; /* Tailwind gray-800 */
  color: #ffffff; /* Tailwind white */
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}

.ml-64 {
  margin-left: 16rem; /* Width of the sidebar */
}

.max-w-2xl {
  max-width: 32rem; /* Reduced width for the main content */
}
</style>
