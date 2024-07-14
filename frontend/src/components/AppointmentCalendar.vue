<template> 
    <div class="p-4 bg-white shadow-md rounded-lg max-w-4xl mx-auto my-8">
      <h1 class="text-2xl font-bold mb-4">Calendar</h1>
      <div class="p-4" bg-gray-100 rounded-lg>
        <FullCalendar :options="calendarOptions" class="max-h-[80vh] overflow-auto"/> 
      </div>
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
          events: '/api/appointments',
        }   
      };
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