<script>
import { defineComponent } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ApiService from '../services/ApiService.js'

export default defineComponent({ 
  name: 'AppointmentCalendar',
  components: {
    FullCalendar,
  },
  data() {
    return {
      appointments: [],
      isSidebarOpen: true, 
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin // needed for dateClick
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents
      },
      currentEvents: [],
    }
  },
  mounted() {
    this.fetchAppointments();
  },
  methods: {
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends; // update a property
    },
    handleDateSelect(selectInfo) {
      console.log('Handling date select with:', selectInfo);

      let title = prompt('Please enter a new title for your event');
      let description = prompt('Please enter a description for your event');
    
      // Get raw user data from local storage
      let rawUserData = localStorage.getItem('user');
      console.log('Raw user data from local storage:', rawUserData);
    
      // Check if rawUserData is undefined or null and handle the error
      if (!rawUserData) {
        console.error('User data is not available in local storage');
        alert('You must be logged in to create an appointment.');
        return;
      }
    
      // Parse user data
      let user;
      try {
        user = JSON.parse(rawUserData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        alert('Error reading user data. Please log in again.');
        return;
      }
    
      console.log('Parsed user data:', user);
    
      if (!user || !user._id) {
        console.error('User ID is missing from the parsed user data');
        alert('You must be logged in to create an appointment.');
        return;
      }
    
      // Create the appointment object
      const newAppointment = {
        title: title || 'New Appointment',
        description: description || 'Appointment description',
        date: selectInfo.startStr, 
        userId: user._id
      };
    
      console.log('New appointment object:', newAppointment);
      this.addAppointment(newAppointment); // Call the addAppointment method
    },       
    async addAppointment(newAppointment) {
      try {
        // Call the API to create the appointment
        const response = await ApiService.createAppointment(newAppointment);

        if (response && response.data) {
          this.appointments.push(response.data);
          this.calendarOptions.events = this.appointments;
          
          console.log('Appointment created:', response.data);
        } else {
          console.error('Failed to create appointment: No response data');
        }
      } catch (error) {
        console.error('Error adding appointment:', error);
      }
    },
    handleEventClick(clickInfo) {
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
      }
    },
    handleEvents(events) {
      this.currentEvents = events
    },
    async fetchAppointments() {
      try {
        const response = await ApiService.getAppointments('/appointments');
        this.appointments = response.data;
        this.calendarOptions.events = this.appointments;
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    },
  },
  watch: {
    appointments(newAppointments) {
      this.calendarOptions.events = newAppointments;
    },
  },
});
</script>  

<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <!-- Top Bar -->
    <div class="top-bar bg-sky-500 text-white p-4 shadow-md">
      <h2 class="text-2xl font-bold">Calendar</h2>
      <div class="mt-4">
        <h3 class="appointments-heading text-lg font-bold">Instructions</h3>
        <ul class="ml-4 list-disc">
          <li>Select dates to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
        <label class="block mt-4">
          <input
            type="checkbox"
            :checked="calendarOptions.weekends"
            @change="handleWeekendsToggle"
          />
          Toggle weekends
        </label>
        <div class="mt-4">
          <h3 class="font-bold">All Events ({{ currentEvents.length }})</h3>
          <ul class="ml-4 list-disc">
            <li v-for="event in currentEvents" :key="event.id">
              <b>{{ event.startStr }}</b> <i>{{ event.title }}</i>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="calendar-container mt-6 mx-auto max-w-7xl px-4">
      <div class="full-calendar bg-white rounded-lg shadow-lg p-6 relative">
        <button @click="$emit('close-calendar')" class="close-button">&times;</button>
        <FullCalendar
          class="demo-app-calendar"
          :options="calendarOptions"
        >
          <template v-slot:eventContent="arg">
            <b>{{ arg.timeText }}</b> <i>{{ arg.event.title }}</i>
          </template>
        </FullCalendar>
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-bar {
  background-color: #0ea5e9;
  color: white;
  padding-bottom: 1rem;
}

h2 {
  margin: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
}

ul {
  margin: 0;
  padding-left: 1.5rem;
}

.calendar-container {
  flex-grow: 1;
  max-width: 1100px;
  width: 100%;
  margin-top: 2rem;
}
.full-calendar {
  position: relative;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  max-width: 80%;
  margin: 0 auto;
  overflow-x: auto;
}

.close-button {
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  background-color: transparent;
  color: #dc2626;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.demo-app-calendar {
  font-size: 1rem;
  line-height: 1.5;
}

b {
  margin-right: 0.3rem;
}

@media (max-width: 768px) {
  .top-bar h2 {
    font-size: 1.5rem;
  }

  .full-calendar {
    max-width: 95%;
    padding: 1rem;
  }

  .demo-app-calendar {
    font-size: 0.8rem;
  }

  .close-button {
    font-size: 1.25rem;
  }
}
</style>











