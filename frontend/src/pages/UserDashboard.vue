<script> 
import ApiService from '../services/ApiService.js';
import AppointmentCalendar from './AppointmentCalendar.vue';
import mitt from 'mitt';

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
      isLoading: false,
      pollingInterval: 5000,
      selectedAppointment: null,
      showRescheduleModal: false,
      rescheduleDate: '',
      rescheduleAppointmentData: {
        id: '',
        date: '',
      },
      isSidebarOpen: true, // Default to true for the sidebar to be open initially
      isCalendarOpen: false,
      successMessage: '',
      errorMessage: '',
      emitter: mitt(),
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
    this.emitter.on('appointment-updated', this.updateAppointment);
  },
  beforeUnmount() {
    this.emitter.off('appointment-updated', this.updateAppointment);
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
      this.isLoading = true;
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
      } finally {
        this.isLoading = false;
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
      console.log('Selected appointment;', this.selectedAppointment);
    },
    rescheduleAppointment(appointment) {
     this.rescheduleAppointmentData.id = appointment._id;
     this.rescheduleAppointmentData.date = appointment.date;
      this.showRescheduleModal = true;
      this.selectedAppointment = appointment;
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
    async changeStatus(appointmentId, status) {
      try {
        const token = localStorage.getItem('token');
        const response = await ApiService.updateAppointmentStatus(appointmentId, { status }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          this.emitter.emit('appointment-updated', response.data); // Emit the event with updated appointment data
        }
      } catch (error) {
        console.error('Failed to update appointment status:', error.response ? error.response.data : error.message);
      }
    },
    mounted() {
      // Fetch appointments on component mount
      this.fetchAppointments();

      this.interval = setInterval(() => {
        this.fetchAppointments();
      }, this.pollingInterval);

      // Listen to the 'appointment-updated' event
      this.emitter.on('appointment-updated', () => {
        this.fetchAppointments();
      }); 
    },
    updateAppointment(updatedAppointment) {
      const index = this.appointments.findIndex(appointment => appointment._id === updatedAppointment._id)
      if (index !== -1) {
        this.appointments.splice(index, 1, updatedAppointment);
      }
      if (this.selectedAppointment && this.selectedAppointment._id === updatedAppointment._id) {
        this.selectedAppointment = updatedAppointment;
      }
    },

    openRescheduleModal() {
      this.rescheduleAppointmentData.id = this.selectedAppointment._id;
      this.rescheduleAppointmentData.date = this.selectedAppointment.date;
      this.showRescheduleModal = true;
    },
    closeModal() {
      this.showRescheduleModal = false;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    toggleCalendar() {
      this.isCalendarOpen = !this.isCalendarOpen;
    },
    showSuccessMessage(message) {
      this.successMessage = message;
    },
    showerrorMessage(message) {
      this.errorMessage = message;
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
    },
    beforeDestroy() {
      // Clear interval when component is destroyed
      clearInterval(this.interval);    }
  },
}; 
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <div :class="['sidebar bg-sky-500 text-white shadow-md transition-transform duration-300', { 'translate-x-0': isSidebarOpen, '-translate-x-full hidden': !isSidebarOpen }]">
      <div class="p-4 flex items-center">
        <h2 class="text-2xl font-bold truncate">Dashboard</h2>
      </div>
      <div class="flex flex-col overflow-y-auto max-h-[80vh]">
        <h3 class="appointments-heading text-lg font-bold mb-2 ml-5">Appointments</h3>
        <ul class="space-y-2">
          <li
            v-for="appointment in appointments"
            :key="appointment._id"
            class="p-2 ml-5 bg-gray-900 rounded hover:bg-orange-500 cursor-pointer"
            @click="selectAppointment(appointment)"
          >
            <span class="font-medium">{{ appointment.title }}</span>
          </li>
        </ul>
        <button @click="toggleCalendar" class="w-32 ml-5 mt-4 bg-sky-600 py-2 px-2 rounded-md text-center hover:bg-sky-700">
          Calendar
        </button>
        <button @click="logout" class="w-32 ml-5 mt-4 bg-red-600 py-2 px-4 rounded-md text-center hover:bg-red-700">
          <span class="font-medium">Logout</span> 
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div :class="['main-content flex-1 p-4 bg-gray-100 relative', {'ml-16': isSidebarOpen, 'full-width': !isSidebarOpen}]">
      <!-- Header -->
      <h2 class="text-2xl font-bold text-gray-800 text-center">User Dashboard</h2>

      <!-- Message Display -->
      <div v-if="errorMessage" class="text-red-500 mb-2">{{ errorMessage }}</div>
      <div v-if="successMessage" class="text-green-500 mb-2">{{ successMessage }}</div>

      <!-- Appointment Form -->
      <div class="appointment-container overflow-y-auto max-h-[80vh] p-4 bg-white shadow rounded-md mx-auto w-full md:w-3/4 lg:w-1/2">
        <form @submit.prevent="createAppointment" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            v-model="newAppointment.title"
            type="text"
            placeholder="Title"
            required
            class="p-2 border rounded w-full"
          />
          <input
            v-model="newAppointment.description"
            type="text"
            placeholder="Description"
            class="p-2 border rounded w-full"
          />
          <input
            v-model="newAppointment.date"
            type="date"
            placeholder="Date"
            required
            class="p-2 border rounded w-full"
            :min="today"
            :max="oneWeekFromToday"
          />
          <div class="col-span-2">
            <button
              type="submit"
              class="bg-blue-500 text-white p-2 rounded w-full border border-blue-700"
            >
              Create Appointment
            </button>
          </div>
        </form>
      </div>
              <!-- Appointment Details -->
        <div v-if="selectedAppointment" class="appointment-details">
          <h3 class="text-xl font-semibold mb-2 text-gray-700 text-center">Appointment Details</h3>
          <div class="p-4 bg-gray-300 rounded shadow-inner">
            <p><strong>Title:</strong> {{ selectedAppointment.title }}</p> 
            <p><strong>Description:</strong> {{ selectedAppointment.description }}</p>
            <p><strong>Date:</strong> {{ selectedAppointment.date }}</p>

            <!-- Reschedule and Cancel Buttons -->
            <div class="mt-4">
              <button @click="openRescheduleModal" class="bg-yellow-500 text-white p-2 rounded border border-yellow-700">
                Reschedule
              </button>
              <button @click="cancelAppointment(selectedAppointment._id)" class="bg-red-500 text-white p-2 rounded border border-red-700 ml-4">
                Cancel
              </button>
            </div>
          </div>

          <!-- Modal for Reschedule -->
          <div v-if="showRescheduleModal" class="modal">
            <!-- Modal content -->
            <div class="modal-content">
              <span class="close" @click="closeModal">&times;</span>
              <h2>Reschedule Appointment</h2>
              <form @submit.prevent="submitReschedule">
                <label for="newDate">New Date:</label>
                <input
                  type="date"
                  v-model="rescheduleAppointmentData.date"
                  :min="today"
                  :max="oneWeekFromToday"
                  required
                />
          <div class="modal-actions mt-4">
            <button type="submit" class="bg-blue-500 text-white p-2 rounded">Confirm</button>
          </div>
              </form>
            </div>
          </div>
        </div>

      <!-- Appointment Calendar -->
      <transition name="fade">
        <div v-if="isCalendarOpen" class="fixed overflow-y-auto max-h-[80vh] inset-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
          <div class="w-full max-w-screen-md h-3/4 max-h-screen bg-white rounded-lg shadow-lg p-4 relative">
            <AppointmentCalendar @close-calendar="toggleCalendar" /> 
          </div>
        </div>
      </transition>

      <!-- Sidebar Toggle Button -->
      <button
        @click="toggleSidebar"
        class="fixed top-2 left-2 z-20 bg-gray-900 text-white p-2 rounded-md"
      > ☰
      </button>
    </div>
  </div>
</template>

<style scoped> 
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: -30%;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color:rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  position: relative;
  text-align: center;
}

.close {
  position: absolute;
  top: 5px;
  right: 15px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}

.close:hover {
  color: red;
}

.sidebar {
  width: 16rem;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  background-color: #343a40;
  padding-top: 4rem;
  transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
}

.sidebar.-translate-x-full {
  transform: translateX(-100%);
}

.sidebar.translate-x-0 {
  transform: translateX(0);
}

.sidebar.hidden {
  width: 0;
}

.main-content {
  flex: 1;
  margin-left: 16rem; /* Reserve space for the sidebar */
  transition: margin-left 0.3s ease-in-out;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-content h2 {
  margin-bottom: 5px;
  top: 20%;
} 

.main-content.ml-0 {
  margin-left: 0;
}

.main-content.full-width {
  margin-left: 0;
  width: 100%;
}

.appointment-container {
  width: 100%;
  max-width: 800px;
  margin-top: 10px;
  background: white;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.appointment-details {
  width: 100%;
  max-width: 800px;
  margin-top: 10px;
  background: white;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.appointment-details h3 {
  margin-top: 0;
}

.toggle-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: white;
  cursor: pointer;
}

.toggle-button:hover {
  background-color: #f0f0f0;
}

@media screen and (max-width: 767px) {
  .sidebar {
    width: 10rem;
    height: auto;
    position: relative;
    transform: translateX(0);
  }

  .sidebar.translate-x-0 {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    padding: 10px;
    max-width: 100%;
  } 

  .appointment-container {
    padding: 15px;
  }
}
</style>







