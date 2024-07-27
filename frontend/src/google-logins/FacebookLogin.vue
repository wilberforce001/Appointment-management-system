<template>
    <div class="login">
      <h2>Login</h2>
      <button @click="loginWithFacebook">Login with Facebook</button>
    </div>
  </template>
  
  <script>
  import ApiService from '../services/ApiService';
  
  export default {
    methods: {
      loginWithFacebook() {
        ApiService.loginWithFacebook();
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
  