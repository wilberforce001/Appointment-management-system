<script>
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted, watch } from 'vue';
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
    const showSidebar = ref(true); // Sidebar visibility
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
      } catch (error) {
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
        errorMessage.value = 'Failed to add time slot. Please try again.';
      }
    };

    const changeStatus = async (appointmentId, status) => {
      try {
        isLoading.value = true;
        const response = await ApiService.updateAppointmentStatus(appointmentId, status, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (response.status === 200) {
          successMessage.value = `Appointment ${status} successfully`;
          await fetchAppointments();
          selectedAppointment.value = null;
        }
      } catch (error) {
        errorMessage.value = 'Failed to update appointment status. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    const selectAppointment = (appointment) => {
      selectedAppointment.value = appointment;
      showSidebar.value = true;
    };

    const handleResize = () => {
      isDesktop.value = window.innerWidth >= 768;
    };

    const toggleSidebar = () => {
      showSidebar.value = !showSidebar.value;
        if (!isDesktop.value) {
        document.body.classList.toggle('sidebar-open');
      }
    };

    const toggleCalendar = () => {
      isCalendarOpen.value = !isCalendarOpen.value;
    }

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

      // Watch for changes to isDesktop
    watch(isDesktop, (newVal) => {
      if(newVal) {
        showSidebar.value = true;
      } else {
        showSidebar.value = false;
        document.body.classList.remove('sidebar-open');
      }
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
      showSidebar,
      toggleSidebar,
      isDesktop,
      isCalendarOpen,
      toggleCalendar,
      formFields,
      logout,
    };
  },
}
</script>

<template>
  <div class="flex min-h-screen">
    <!--Sidebar-->
    <div :class="['sidebar text-white shadow-md transition-transform duration-300', { 'translate-x-0': showSidebar, '-translate-x-full hidden': !showSidebar }]">
      <div class="p-4 flex items-center">
        <h2 class="text-xl font-bold mb-0">Dashboard</h2>
      </div>
      <div class="flex flex-col overflow-y-auto max-h-[80vh]">
        <h3 class="appointments-heading text-lg font-bold mb-2 ml-5">Appointments</h3>
        <ul class="space-y-2">
          <li
            v-for="appointment in appointments"
            :key="appointment._id"
            class="p-2 ml-5 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
            @click="selectAppointment(appointment)"
          >
            <span class="font-medium">{{ appointment.title }}</span> - 
            <span class="text-gray-300">{{ appointment.date }}</span>
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
    <div :class="['main-content flex-1 p-4 bg-gray-100 relative', {'ml-16': showSidebar, 'full-width': !showSidebar}]">
      <!-- Header -->
      <h2 class="text-2xl font-bold text-gray-800 text-center">Admin Dashboard</h2>

      <!-- Message Display -->
      <div v-if="errorMessage" class="text-red-500 mb-2">{{ errorMessage }}</div>
      <div v-if="successMessage" class="text-green-500 mb-2">{{ successMessage }}</div>

      <!-- Container for Manage Time Slots and Selected Appointment -->
      <div class="appointment-container overflow-y-auto max-h-[80vh] p-4 bg-white shadow rounded-md mx-auto w-full md:w-3/4 lg:w-1/2">
        <!-- Manage Available Time Slots -->
        <div class="mb-6">
          <h3 class="text-xl font-semibold mb-2 text-gray-700 text-center">Manage Time Slots</h3>
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
          <h3 class="text-xl font-semibold mb-2 text-gray-700 text-center">Selected Appointment</h3>
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
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
    /*left: -100%;*/
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
