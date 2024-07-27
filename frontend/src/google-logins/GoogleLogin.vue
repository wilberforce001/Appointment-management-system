<template>
    <div class="login">
      <h2>Login</h2>
      <button @click="loginWithGoogle">Login with Google</button>
    </div>
  </template>
  
  <script>
  import ApiService from '../services/ApiService';
  
  export default {
    methods: {
      loginWithGoogle() {
        ApiService.loginWithGoogle();
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
  