<script>
import ApiService from '../services/ApiService.js';
import AppointmentCalendar from './AppointmentCalendar.vue';

export default {
  components: { AppointmentCalendar },
  name: 'UserDashboard',
  data() {
    return {
      newAppointment: {
        title: '',
        description: '',
        date: '',
      },
      appointments: [],
      selectedAppointment: null,
      showRescheduleModal: false,
      rescheduleAppointmentData: {
        id: '',
        date: '',
      },
      isSidebarOpen: true, // Default to true for the sidebar to be open initially
      isCalendarOpen: false,
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token');
    },
    today() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    },
    oneWeekFromToday() {
      const today = new Date();
      const oneWeekFromToday = new Date(today.setDate(today.getDate() + 7));
      return oneWeekFromToday.toISOString().split('T')[0];
    },
  },
  async created() {
    await this.fetchAppointments();
  },
  methods: {
    async createAppointment() {
      try {
        const token = localStorage.getItem('token');
        const response = await ApiService.createAppointment(this.newAppointment, {
          headers: { Authorization: `Bearer ${token}`},
        });
        this.appointments.push(response.data);
        this.newAppointment = { title: '', description: '', date: '' };
      } catch (error) {
        console.error('Create appointment failed:', error.response ? error.response.data : error.message);
      }
    },
    async fetchAppointments() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await ApiService.getAppointments({
          headers: { Authorization: `Bearer ${token}`},
        });
        this.appointments = response.data;
      } catch (error) {
        console.error('Fetch appointments failed:', error.response ? error.response.data : error.message);
      }
    },
    async cancelAppointment(appointmentId) {
      try {
        const token = localStorage.getItem('token');
        await ApiService.deleteAppointment(appointmentId, {
          headers: { Authorization: `Bearer ${token}`},
        });
        this.appointments = this.appointments.filter(appointment => appointment._id !== appointmentId);
        if (this.selectedAppointment && this.selectedAppointment._id === appointmentId) {
          this.selectedAppointment = null;
        }
      } catch (error) {
        console.error('Cancel appointment failed:', error.response ? error.response.data : error.message);
      }
    },
    selectAppointment(appointment) {
      this.selectedAppointment = appointment;
    },
    rescheduleAppointment(appointment) {
      this.rescheduleAppointmentData.id = appointment._id;
      this.rescheduleAppointmentData.date = appointment.date;
      this.showRescheduleModal = true;
    },
    async submitReschedule() {
      try {
        const token = localStorage.getItem('token');
        const response = await ApiService.updateAppointment(this.rescheduleAppointmentData.id, {
          date: this.rescheduleAppointmentData.date,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedAppointment = response.data;
        const index = this.appointments.findIndex(appointment => appointment._id === updatedAppointment._id);
        if (index !== -1) {
          this.appointments.splice(index, 1, updatedAppointment);
        }
        if (this.selectedAppointment && this.selectedAppointment._id === updatedAppointment._id) {
          this.selectedAppointment = updatedAppointment;
        }
        this.showRescheduleModal = false;
      } catch (error) {
        console.error('Reschedule appointment failed:', error.response ? error.response.data : error.message);
      }
    },
    closeModal() {
      this.showRescheduleModal = false;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      if (this.isSidebarOpen) {
        this.$refs.mainContent.style.marginLeft = '16rem';
      } else {
        this.$refs.mainContent.style.marginLeft = '0';
      }
    },
    toggleCalendar() {
      this.isCalendarOpen = !this.isCalendarOpen;
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },

    beforeRouteEnter(to, from, next) {
      if (!localStorage.getItem('token')) {
        next('/login');
      } else {
        next();
      }
    }
  },
};
</script>

<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-gray-100 relative">
    <button @click="toggleSidebar" class="toggle-button">
      ☰
    </button>
    <div class="flex">
      <!-- Sidebar -->
      <div :class="['sidebar bg-sky-500 text-white shadow-md transition-transform duration-300 md:w-64', { 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }]">
        <div class="p-4 flex items-center overflow-hidden">
          <h2 class="text-2xl font-bold truncate">Dashboard</h2>
        </div>
        <div class="flex flex-col overflow-hidden">
          <h3 class="appointments-heading text-lg font-bold mb-0 ml-5 truncate">Appointments</h3>
          <div class="overflow-y-auto" style="max-height: 60vh;">
            <ul class="space-y-0">
            <li
              v-for="appointment in appointments"
              :key="appointment._id"
              @click="selectAppointment(appointment)"
              class="p-2 hover:bg-sky-400 cursor-pointer flex items-center space-x-2 truncate"
            >
              <span class="font-medium truncate ml-4">{{ appointment.title }}</span>
            </li>
          </ul>
          </div>
          <!-- Button to toggle the calendar visibility -->
          <div class="mt-2 flex flex-wrap space-x-2">
            <button @click="toggleCalendar" class="w-32 mt-2 md:mt-0 ml-5 bg-sky-600 py-2 px-2 rounded-md text-center hover:bg-sky-700 md:w-auto">
              Calendar
            </button>
            <button @click="logout" class="w-32 mt-4 md:mt-0 ml-5 bg-red-600 py-2 px-2 rounded-md text-center hover:bg-sky-700 md:w-auto">
              <span class="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div ref="mainContent" :class="['main-content', 'flex-grow', 'flex-shrink', { 'md:ml-64': isSidebarOpen }, 'transition-margin', 'duration-300']">
        <div class="relative flex-1 p-6 mx-auto">
          <form @submit.prevent="createAppointment" class="relative space-y-2 bg-white p-6 rounded-lg shadow-md w-full mx-auto">
            <input
              v-model="newAppointment.title"
              type="text"
              placeholder="Title"
              required
              class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model="newAppointment.description"
              type="text"
              placeholder="Description"
              class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model="newAppointment.date"
              type="date"
              placeholder="Date"
              required
              class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              :min="today"
              :max="oneWeekFromToday"
            />
            <button
              type="submit"
              class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Appointment
            </button>
          </form>

          <!-- Appointment Details -->
          <div v-if="selectedAppointment" class="bg-white p-6 rounded-lg shadow-md w-full mt-3">
            <h3 class="text-xl font-bold mb-4">Appointment Details</h3>
            <p><strong>Title:</strong> {{ selectedAppointment.title }}</p>
            <p><strong>Description:</strong> {{ selectedAppointment.description }}</p>
            <p><strong>Date:</strong> {{ selectedAppointment.date }}</p>
            <div class="mt-4 flex flex-wrap space-x-2">
              <button @click="rescheduleAppointment(selectedAppointment)" class="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 md:w-auto">
                Reschedule
              </button>
              <button @click="cancelAppointment(selectedAppointment._id)" class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 md:w-auto mt-2 md:mt-0">
                Cancel
              </button>
            </div>
          </div>

          <!-- Reschedule Modal -->
          <div v-if="showRescheduleModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center" @click="closeModal">
            <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm" @click.stop style="top: 10%; position: absolute;">
              <h3 class="text-lg font-bold mb-4">Reschedule Appointment</h3>
              <form @submit.prevent="submitReschedule">
                <input
                  v-model="rescheduleAppointmentData.date"
                  type="date"
                  required
                  class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :min="today"
                  :max="oneWeekFromToday"
                />
                <button
                  type="submit"
                  class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
                >
                  Reschedule
                </button>
              </form>
            </div>
          </div>

          <!-- Conditionally render the calendar -->
          <div v-if="isCalendarOpen" class="w-full flex justify-center mt-6">
            <AppointmentCalendar @close-calendar="toggleCalendar" /> 
          </div>       
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 90%;
  width: 100%;
  padding: 1rem;
  z-index: 900;
  position: fixed;
}
.toggle-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background-color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}
.toggle-button:hover {
  background-color: #f0f0f0;
}
.sidebar {
  width: 16rem;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 4rem;
  background-color: #1f2937;
  transition: transform 0.3s ease-in-out;
}
.sidebar a {
  color: white;
  display: block;
  padding: 1rem;
  text-decoration: none;
}
.sidebar a:hover {
  background-color: #374151;
}
.form-container,
.appointment-details {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}
.form-container input,
.form-container textarea,
.form-container button {
  width: 100%;
  margin-bottom: 10px;
}

.main-content {
  height: calc(100vh - 4rem); /* Adjust height based on your layout */
  overflow-y: auto; /* Enable vertical scrolling */
  margin-left: 16rem;
  transition: margin-left 0.3s ease;
  flex-grow: 1;
  flex-shrink: 1;
  position: relative;
  z-index: 500;
}

@media (max-width: 768px) {
  .sidebar {
    width: 8rem;
  }
  .main-content {
    margin-left: 4rem;
  }
}

@media (min-width: 768px) {
  .modal {
    max-width: 500px;
  }
  .main-content {
    margin-left: 2rem;
  }
}
</style>







