<template>
  <div>
    <UserDashboard />
    <router-view></router-view>
  </div>
</template>

<script>
import UserDashboard from '../pages/UserDashboard.vue';

export default {
  name: 'AppointmentDashboard',
  components: {
    UserDashboard,
  },
}
</script>
