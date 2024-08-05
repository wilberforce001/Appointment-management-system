<template>
    <div class="register">
      <h2>Register</h2>
      <button @click="registerWithGoogle">Register with Google</button>
    </div>
  </template>
  
  <script>
  import ApiService from '../services/ApiService';
  
  export default {
    methods: {
      registerWithGoogle() {
        ApiService.registerWithGoogle();
      },
    },
  };
  </script>
  
  <style scoped>
  .login {
    text-align: center;
    margin-top: 50px;
  }
  </style>
  