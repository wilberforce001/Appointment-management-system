<template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <h2 class="text-lg font-semibold mb-4">Appointments</h2>
    <div v-if="appointments.length === 0" class="text-gray-500">No appointments found.</div>
    <div v-else>
      <ul class="divide-y divide-gray-200">
        <li v-for="appointment in appointments" :key="appointment.id" class="py-2">
          <div class="flex justify-between items-center">
            <div>
              <span class="text-gray-700">{{ appointment.customerName }}</span>
              <span class="text-sm text-gray-500 ml-2">{{ formatDate(appointment.date) }}</span>
            </div>
            <div class="flex space-x-2">
              <button @click="confirmAppointment(appointment)" class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md">Confirm</button>
              <button @click="rescheduleAppointment(appointment)" class="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md">Reschedule</button>
              <button @click="cancelAppointment(appointment)" class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md">Cancel</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      appointments: [] // Initialize with fetched appointments
    };
  },
  methods: {
    formatDate(date) {
      // Implement date formatting as needed
      return new Date(date).toLocaleDateString();
    },
    confirmAppointment(appointment) {
      // Placeholder logic for confirming appointment
      console.log('Confirm appointment:', appointment);
    },
    rescheduleAppointment(appointment) {
      // Placeholder logic for rescheduling appointment
      console.log('Reschedule appointment:', appointment);
    },
    cancelAppointment(appointment) {
      // Placeholder logic for canceling appointment
      console.log('Cancel appointment:', appointment);
    }
  }
};
</script>

<style scoped>
/* Tailwind CSS classes can be used directly */
</style>
