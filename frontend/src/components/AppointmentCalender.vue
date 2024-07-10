<template>
    <div>
      <h1 class="text-2xl font-bold">Calendar</h1>
      <FullCalendar :plugins="calendarPlugins" :events="events" />
    </div>
  </template>
  
  <script>
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';
  
  export default {
    components: { FullCalendar }, 
    data() {
      return {
        events: [
          { title: 'Event 1', start: '2024-07-10' },
          { title: 'Event 2', start: '2024-07-12' }
        ],
        CalendarPlugins: [dayGridPlugin, interactionPlugin]
      };
    }

  };
  </script>
  