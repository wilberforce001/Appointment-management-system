<template>
    <div class="home">
        <h1>Welcome to the Appointment Management System</h1>
        <router-link to="/UserLogin">Login</router-link>
        <router-link to="/UserRegister">Register</router-link>
        <router-link to="/AppointmentCalendar">Calendar</router-link>
    </div>
</template>

<script>
export default {
    name: 'UserHome'
};
</script>

<style scoped>

</style>