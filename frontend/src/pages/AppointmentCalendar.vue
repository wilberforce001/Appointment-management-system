<script>
import { defineComponent } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from '../event-utils'

export default defineComponent({ 
  name: 'AppointmentCalendar',
  components: {
    FullCalendar,
  },
  data() {
    return {
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
        initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
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
  methods: {
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends; // update a property
    },
    handleDateSelect(selectInfo) {
      let title = prompt('Please enter a new title for your event');
      let calendarApi = selectInfo.view.calendar

      calendarApi.unselect() // clear date selection

      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        })
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
    fetchAppointments() {
      // Fetch appointments logic
    },
    mounted() {
      this.fetchAppointments();
    }
}
});

</script>

<template>
  <div class="flex min-h-screen bg-gray-100 relative">
    <!-- Sidebar -->
    <div :class="['sidebar bg-sky-500 text-white shadow-md transition-transform duration-300', { 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }]">
      <div class="p-4 flex items-center">
        <h2 class="text-2xl font-bold">Calendar</h2>
      </div>
      <div class="flex flex-col">
        <h3 class="appointments-heading text-lg font-bold mb-0 ml-5">Instructions</h3>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
        <label class="ml-5">
          <input
            type='checkbox'
            :checked='calendarOptions.weekends'
            @change='handleWeekendsToggle'
          />
          toggle weekends
        </label>
        <div class="ml-5 mt-4">
          <h2>All Events ({{ currentEvents.length }})</h2>
          <ul>
            <li v-for='event in currentEvents' :key='event.id'>
              <b>{{ event.startStr }}</b>
              <i>{{ event.title }}</i>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="calendar-container">
      <button @click="$emit('close-calendar')" class="close-button">
      &times;
      </button>
          <FullCalendar
            class='demo-app-calendar'
            :options='calendarOptions'
          >
            <template v-slot:eventContent='arg'> 
              <b>{{ arg.timeText }}</b> 
              <i>{{ arg.event.title }}</i>
            </template>
          </FullCalendar>
        </div>
  </div>
</template>

<style scoped>
h2 {
  margin: 0;
  font-size: 20px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
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

.calendar-container {
  position: relative;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  max-width: 30rem;
  margin-top: 0.75rem;
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


.calendar-container .fc-toolbar-title {
  font-size: 0.25rem !important;
}

.calendar-container .fc-button {
  font-size: 0.25rem !important;
  padding: 0.25rem 0.5rem !important;
}

b {
margin-right: 3px;
}

</style>

