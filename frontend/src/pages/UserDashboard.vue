<template>
  <div class="flex min-h-screen bg-gray-100 relative">
    <!-- Sidebar Toggle Button -->
    <button @click="toggleSidebar" class="toggle-button">
      ☰
    </button>

    <!-- Sidebar and Main Content Container -->
    <div class="flex flex-1">
      <!-- Sidebar -->
      <div :class="['sidebar bg-sky-500 text-white shadow-md transition-transform duration-300', { 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }]">
        <div class="p-4 flex items-center">
          <h2 class="text-2xl font-bold">Dashboard</h2>
        </div>
        <div class="flex flex-col">
          <h3 class="appointments-heading text-lg font-bold mb-2">Appointments</h3>
          <ul class="space-y-2 w-full">
            <li
              v-for="appointment in appointments"
              :key="appointment._id"
              @click="selectAppointment(appointment)"
              class="p-2 hover:bg-sky-400 cursor-pointer flex items-center space-x-2 truncate"
              style="max-width: calc(100% - 1rem);"
            >
              <span class="font-medium truncate">{{ appointment.title }}</span>
            </li>
          </ul>
          <button @click="logout" class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mt-4 w-3/4 mx-auto flex items-center justify-center space-x-2">
            <span class="font-medium">Logout</span>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 transition-transform duration-300" :class="{ 'ml-64': isSidebarOpen }">
        <!-- Create Appointment Form -->
        <form @submit.prevent="createAppointment" class="space-y-4 bg-white p-6 rounded-lg shadow-md mb-6 w-3/4 mx-auto">
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
            class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Create Appointment
          </button>
        </form>

        <!-- Appointment Details -->
        <div v-if="selectedAppointment" class="bg-white p-6 rounded-lg shadow-md mb-6 w-3/4 mx-auto appointment-details">
          <h3 class="text-xl font-bold mb-4">Appointment Details</h3>
          <p><strong>Title:</strong> {{ selectedAppointment.title }}</p>
          <p><strong>Description:</strong> {{ selectedAppointment.description }}</p>
          <p><strong>Date:</strong> {{ selectedAppointment.date }}</p>
          <div class="mt-4 flex space-x-2">
            <button @click="rescheduleAppointment(selectedAppointment)" class="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600">
              Reschedule
            </button>
            <button @click="cancelAppointment(selectedAppointment._id)" class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
              Cancel
            </button>
          </div>
        </div>

        <!-- Reschedule Modal -->
        <div v-if="showRescheduleModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center" @click="closeModal">
          <div class="bg-white p-6 rounded-lg shadow-lg" @click.stop>
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
      </div>
    </div>
  </div>
</template>


<script>
import ApiService from '../services/ApiService.js';

export default {
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
      isSidebarOpen: true,  // Default to true for the sidebar to be open initially
    };
  },
  computed: {
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
          headers: { Authorization: `Bearer ${token}` },
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
          headers: { Authorization: `Bearer ${token}` },
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
          headers: { Authorization: `Bearer ${token}` },
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
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  },
};
</script>

<style scoped>
/* Sidebar Styles */
.sidebar {
  width: 16rem; /* Width of the sidebar */
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10; /* Sidebar should be above other content */
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

/* Sidebar transition classes */
.translate-x-0 {
  transform: translateX(0);
}

.-translate-x-full {
  transform: translateX(-100%);
}

/* Toggle Button Styles */
.toggle-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 50; /* Button should be above everything */
  padding: 0.5rem;
  font-size: 1.5rem;
  color: #1d4ed8;
  background-color: white;
  border: none;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.toggle-button:hover {
  background-color: #e2e8f0;
}

/* Main Content Styles */
.flex-1 {
  flex: 1;
}

.ml-64 {
  margin-left: 16rem; /* Adjust according to sidebar width */
}

/* Modal Styles */
.fixed {
  position: fixed; /* Ensure modal is fixed on screen */
  z-index: 100; /* Modal should be above the sidebar */
}

/* Specific styling for the User Dashboard text */
.sidebar h2 {
  margin-top: 4rem;
  margin-bottom: 0rem; 
  }

/*Appointment Details Styles */
.appointment-details {
  z-index: 50; /* Ensure appointment details are above the sidebar */
}

.appointments-heading {
  margin-left: 1rem;
}

</style>










