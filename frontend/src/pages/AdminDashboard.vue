

<script>
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import ApiService from '../services/ApiService.js';
import AppointmentCalendar from './AppointmentCalendar.vue';

export default {
  components: { AppointmentCalendar },
  name: 'AdminDashboard',
  setup() {
    const router = useRouter();
    const isLoading = ref(false);
    const appointments = ref([]);
    const newTimeSlot = ref({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
    });
    const formFields = ref([
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'text' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'startTime', label: 'Start Time', type: 'time' },
      { name: 'endTime', label: 'End Time', type: 'time' },
    ]);

    const isDesktop = ref(window.innerWidth >= 768);
    const showSidebar = ref(true); // Sidebar is always open
    const errorMessage = ref('');
    const successMessage = ref(''); 
    const selectedAppointment = ref(null);
    const isCalendarOpen = ref(false);

    const fetchAppointments = async () => {
      try {
        const response = await ApiService.getAppointments({
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        appointments.value = response.data;
        console.log('Fetched Appointments:', appointments.value);
      } catch (error) {
        console.error('Fetch appointments failed:', error.response ? error.response.data : error);
        errorMessage.value = 'Failed to fetch appointments. Please try again.';
      }
    };

    const addTimeSlot = async () => {
      try {
        const response = await ApiService.createAppointment(newTimeSlot.value, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.status === 201) {
          newTimeSlot.value = { title: '', description: '', date: '', startTime: '', endTime: '' };
          successMessage.value = 'Time slot added successfully.';
          await fetchAppointments();
        }
      } catch (error) {
        console.error('Add time slot failed:', error.response ? error.response.data : error.message);
        errorMessage.value = 'Failed to add time slot. Please try again.';
      }
    };

    const changeStatus = async (appointmentId, status) => {
      try {
        isLoading.value = true;
        const response = await ApiService.updateAppointmentStatus(appointmentId, status, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (response && response.status === 200) {
          successMessage.value = `Appointment ${status} successfully`;
          await fetchAppointments();
          selectedAppointment.value = null;
        }
      } catch (error) {
        console.error('Update appointment status failed:', error.response ? error.response.data : error.message);
        errorMessage.value = 'Failed to update appointment status. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    const selectAppointment = (appointment) => {
      selectedAppointment.value = appointment;
      if (!isDesktop.value) {
        showSidebar.value = false;
      }
    };

    const handleResize = () => {
      isDesktop.value = window.innerWidth >= 768;
    };

    const logout = () => {
      localStorage.removeItem('token');
      router.push('/login');
    };

    onMounted(() => {
      fetchAppointments();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    return {
      isLoading,
      appointments,
      newTimeSlot,
      selectedAppointment,
      errorMessage,
      successMessage,
      fetchAppointments,
      addTimeSlot,
      changeStatus,
      selectAppointment,
      isCalendarOpen,
      formFields,
      logout,
    };
  },
}
</script>

<template>
  <div class="flex min-h-screen relative">
    <!-- Sidebar -->
    <div class="sidebar bg-sky-500 text-white shadow-md">
      <button @click="toggleSidebar" class="toggle-button">
        ☰
      </button>
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
      <button @click="toggleCalendar" class="w-full mt-4 bg-sky-600 py-2 px-4 rounded-md text-center hover:bg-sky-700">
        Calendar
      </button>
      <button @click="logout" class="w-full mt-4 bg-red-600 py-2 px-4 rounded-md text-center hover:bg-red-700">
        <span class="font-medium">Logout</span>
      </button>
    </div>
    
    <!-- Main Content -->
    <div class="main-content p-4 bg-gray-100 relative border border-blue-500">
      <!-- Header -->
      <h2 class="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

      <!-- Message Display -->
      <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
      <div v-if="successMessage" class="text-green-500 mb-4">{{ successMessage }}</div>

      <!-- Container for Manage Time Slots and Selected Appointment -->
      <div class="appointment-container overflow-y-auto max-h-[80vh] p-4 bg-white shadow rounded-md mx-auto w-full md:w-3/4 lg:w-1/2 relative border border-green-500">
        <!-- Manage Available Time Slots -->
        <div class="mb-6">
          <h3 class="text-xl font-semibold mb-2 text-gray-700">Manage Time Slots</h3>
          <form @submit.prevent="addTimeSlot" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Form Inputs -->
            <div v-for="field in formFields" :key="field.name">
              <label :for="field.name" class="block text-gray-600 text-sm">{{ field.label }}</label>
              <input v-model="newTimeSlot[field.name]" :type="field.type" :id="field.name" class="p-2 border rounded w-full" />
            </div>
            <div class="col-span-2">
              <button type="submit" class="bg-blue-500 text-white p-2 rounded w-full border border-blue-700">Add Time Slot</button>
            </div>
          </form>
        </div>

        <!-- View Selected Appointment -->
        <div v-if="selectedAppointment" class="mt-3">
          <h3 class="text-xl font-semibold mb-2 text-gray-700">Selected Appointment</h3>
          <div class="p-4 bg-gray-300 rounded shadow-inner">
            <p><strong>Title:</strong> {{ selectedAppointment.title }}</p>
            <p><strong>Date:</strong> {{ selectedAppointment.date }}</p>
            <p><strong>Start Time:</strong> {{ selectedAppointment.startTime }}</p>
            <p><strong>End Time:</strong> {{ selectedAppointment.endTime }}</p>
            <p><strong>Description:</strong> {{ selectedAppointment.description }}</p>
            <div class="mt-4">
              <button @click="changeStatus(selectedAppointment._id, 'completed')" class="bg-green-500 text-white p-2 rounded border border-green-700">
                Confirmed
              </button>
              <button @click="changeStatus(selectedAppointment._id, 'canceled')" class="bg-red-500 text-white p-2 rounded border border-red-700 ml-4">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Appointment Calendar -->
      <transition name="fade">
        <div v-if="isCalendarOpen" class="absolute inset-0 flex justify-center items-center bg-white bg-opacity-90">
          <div class="w-full max-w-4xl p-4 bg-white shadow-lg rounded-md">
            <h2 class="text-2xl font-bold mb-4">Appointment Calendar</h2>
            <AppointmentCalendar :appointments="appointments" />
            <button @click="toggleCalendar" class="mt-4 bg-red-500 text-white py-2 px-4 rounded-md">
              Close Calendar
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  transform: translateX(0);
}

.sidebar.show {
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
}

.sidebar.hide {
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.toggle-button {
  position: absolute;
  top: 20px;
  right: -20px;
  background: #333;
  color: white;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
}

.main-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  margin-left: calc(250px + 250px);
  box-sizing: border-box;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers the heading and the container horizontally */
}

.main-content h2 {
  margin-bottom: 20px; /* Adds space between the heading and the container */
  text-align: center; /* Centers the text within the heading */
}

.appointment-container {
  width: 100%;
  max-width: 800px; /* Set a max-width to the container to prevent it from stretching too wide */
  margin-top: 20px;
  background: white;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.appointment-container h3 {
  text-align: center;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ensure proper spacing on smaller screens */
@media screen and (max-width: 767px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
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


