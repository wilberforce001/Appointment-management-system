<template> 
    <div>
      <h1 class="text-2xl font-bold">Calendar</h1>
      <FullCalendar :options="calendarOptions"/>
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
        calendarOptions: {
          plugins: [ dayGridPlugin, interactionPlugin ],
          initialView: 'dayGridMonth',
          dateClick: this.handleDateClick,
          events: [
          { title: 'Event 1', start: '2024-07-10' },
          { title: 'Event 2', start: '2024-07-12' }
        ]
        }
    
      }
    },
    methods: {
      handledateClick: function(arg) {
        alert('date click! ' + arg.dateStr)
      }
    },
    async mounted() {
      // Fetch events from the backend
      try {
        const response = await fetch('http://localhost:5000/api/appointments', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        this.events = data.map(event => ({
          title: event.title,
          start: event.start,
          end: event.end
        }))
      } catch (error) {
        console.error('Error fetching events:', error);
        }
    }

  }; 
  </script>
  <style>
  
  </style>