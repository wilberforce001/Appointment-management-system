<script>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import ApiService from '../services/ApiService.js';
import 'vue3-toastify/dist/index.css';
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
    const errorMessage = ref(''); 
    const selectedAppointment = ref(null);
    const showSidebar = ref (false);
    const isCalendarOpen = ref(false);

    const showSuccessMessage = (message) => {
      toast.success(message, {
        position: 'top-right',
      });
    }
    const showErrorMessage = (message) => {
      toast.error(message, {
        position: 'top-right',
      });
    }

    const fetchAppointments = async () => {
      try {
        const response = await ApiService.getAppointments({ 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        appointments.value = response.data;
        console.log('Fetched Appointments:', appointments.value); // Log the fetched appointments
        appointments.value.forEach(appointment => {
          console.log('Appointment Details:', appointment);
        })

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
          newTimeSlot.value = { title: '', description: '', date: '', startTime: '', endTime: '' }; // Reset form
          await fetchAppointments(); // Refresh appointments list
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
          console.log('Updated Appointment:', response.data); // Log the updated appointment object

          showSuccessMessage(`Appointment ${status} successfully`); 

          await fetchAppointments(); // Refresh appointments list
          selectedAppointment.value = null; // Deselect appointment
          await fetchAppointments();

          // Deselect the appointment after status change
          selectedAppointment.value = null;
        }
      } catch (error) {
        console.error('Update appointment status failed:', error.response ? error.response.data : error.message);
        showErrorMessage('Failed to update appointment status. Please try again.');
      } finally {
        isLoading.value = false;
      }
    };

    const selectAppointment = (appointment) => {
      selectedAppointment.value = appointment;
    };
    const toggleSidebar = () => {
      showSidebar.value = !showSidebar.value;
    };
    const toggleCalendar = () => {
      isCalendarOpen.value = !isCalendarOpen.value;
    };
    const logout = () => {
      localStorage.removeItem('token');
      router.push('/login');
    };

    onMounted(() => {
      fetchAppointments();
    });

    return {
      isLoading,
      appointments,
      newTimeSlot,
      selectedAppointment,
      showSidebar,
      isCalendarOpen,
      errorMessage,
      showSuccessMessage,
      showErrorMessage,
      fetchAppointments,
      addTimeSlot,
      changeStatus,
      selectAppointment,
      toggleSidebar,
      toggleCalendar,
      logout,
    };
  },
}; 
</script>

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
        <!-- Button to toggle the calendar visibility -->
        <button @click="toggleCalendar" class="w-32 mt-4 ml-5 bg-sky-600 py-2 px-2 rounded-md text-center hover:bg-sky-700">
          Calendar
        </button>
 
        <button @click="logout" class="w-32 mt-4 ml-5 bg-red-600 py-2 px-2 rounded-md text-center hover:bg-sky-700">
            <span class="font-medium">Logout</span>
          </button>
      </div>
    </transition>

    <!-- Main Content -->
    <div :class="{'admin-dashboard ml-64': showSidebar, 'ml-0': !showSidebar}" class="flex-1 p-4 transition-all duration-300 ease-in-out max-w-2xl bg-gray-100">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <button @click="toggleSidebar" class="bg-blue-500 text-white p-2 rounded">
          {{ showSidebar ? 'Hide Appointments' : 'Show Appointments' }} 
        </button>
      </div>

      <!-- Container for Manage Time Slots and Selected Appointment -->
      <div class="overflow-y-auto max-h-[80vh] p-4 bg-white shadow rounded-md">
        <!-- Manage Available Time Slots -->
        <div class="mb-6">
          <h3 class="text-xl font-semibold mb-2 text-gray-700">Manage Time Slots</h3>
          <form @submit.prevent="addTimeSlot" class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-600 text-sm">Title:</label>
              <input v-model="newTimeSlot.title" type="text" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-gray-600 text-sm">Description:</label>
              <input v-model="newTimeSlot.description" type="text" class="p-2 border rounded w-full" />
            </div>
            <div>
              <label class="block text-gray-600 text-sm">Date:</label>
              <input v-model="newTimeSlot.date" type="date" class="p-2 border rounded w-full"/>
            </div>
            <div>
              <label class="block text-gray-600 text-sm">Start Time:</label>
              <input v-model="newTimeSlot.startTime" type="time" class="p-2 border rounded w-full"/>
            </div>
            <div>
              <label class="block text-gray-600 text-sm">End Time:</label>
              <input v-model="newTimeSlot.endTime" type="time" class="p-2 border rounded w-full"/>
            </div>
            <div class="col-span-2">
              <button type="submit" class="bg-blue-500 text-white p-2 rounded w-full">Add Time Slot</button>
            </div>
          </form>
          <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
        </div>
      </div>
        <!-- View Selected Appointment -->
          <div class="appointments mt-3">   
          <div v-if="selectedAppointment" class="mt-3">
            <h3 class="text-xl font-semibold mb-2 text-gray-700">Selected Appointment</h3>
            <div class="p-4 bg-gray-300 rounded shadow-inner">
              <p><strong>Title:</strong> {{ selectedAppointment.title }}</p>
              <p><strong>Description:</strong> {{ selectedAppointment.description }}</p>
              <p><strong>Date:</strong> {{ selectedAppointment.date }}</p>
              <p><strong>Status:</strong> {{ selectedAppointment.status }}</p>
              <button @click="changeStatus(selectedAppointment._id, 'confirmed')" class="mt-2 bg-green-500 text-white p-2 rounded">Confirm</button>
              <button @click="changeStatus(selectedAppointment._id, 'canceled')" class="mt-2 ml-3 bg-red-500 text-white p-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
        <!-- Conditionally render the calendar -->
        <div v-if="isCalendarOpen" class="w-full flex justify-center mt-6">
        <AppointmentCalendar @close-calendar="toggleCalendar" /> 
      </div> 
    </div>
  </div>
</template>

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
  margin-left: 30rem; /* Width of the sidebar */
}

.max-w-2xl {
  max-width: 32rem; /* Reduced width for the main content */
}

.overflow-y-auto {
  overflow-y: auto; 
}

.admin-dashboard {
  overflow-y: auto;
  max-height: 80vh;
}

.appointments {
  margin-top: 1rem; /* Create space between the two sections */
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mt-8 {
  margin-top: 1rem;
}
</style>
