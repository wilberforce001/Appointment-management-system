<template>
  <div>
    <h1>Welcome to Appointment Management System</h1>
    <router-link to="/login">Login</router-link>
    <router-link to="/register">Register</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'UserHome',
}
</script>
