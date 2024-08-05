<template>
    <div class="register">
      <h2>Register</h2>
      <button @click="registerWithFacebook">Register with Facebook</button>
    </div>
  </template>
  
  <script>
  import ApiService from '../services/ApiService';
  
  export default {
    methods: {
      registerWithFacebook() {
        ApiService.registerWithFacebook();
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
  