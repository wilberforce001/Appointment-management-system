<template>
    <div class="bg-white shadow-md rounded-lg p-4">
      <h2 class="text-lg font-semibold mb-4">Update Appointment Status</h2>
      <div v-if="appointments.length === 0" class="text-gray-500">No appointments found.</div>
      <div v-else>
        <ul class="divide-y divide-gray-200">
          <li v-for="appointment in appointments" :key="appointment.id" class="py-2">
            <div class="flex justify-between items-center">
              <div>
                <span class="text-gray-700">{{ appointment.customerName }}</span>
                <span class="text-sm text-gray-500 ml-2">{{ formatDate(appointment.date) }}</span>
              </div>
              <div>
                <select v-model="appointment.status" @change="updateAppointmentStatus(appointment)" class="py-1 px-2 border border-gray-300 rounded-md">
                  <option value="confirmed">Confirmed</option>
                  <option value="paid">Paid</option>
                  <option value="canceled">Canceled</option>
                </select>
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
      updateAppointmentStatus(appointment) {
        // Placeholder logic for updating appointment status
        console.log('Updating appointment status:', appointment);
      }
    }
  };
  </script>
  
  
  <style scoped>
  /* Tailwind CSS classes can be used directly */
  </style>
  