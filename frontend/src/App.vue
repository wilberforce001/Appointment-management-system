<template> 
  <div id="app">
    <AppNavigation></AppNavigation>
  <router-view></router-view>
  </div>
</template>

<script>
import AppNavigation from './pages/AppNavigation.vue';

export default {
  name: 'App',
  components: {
    AppNavigation,
  },

}; 
</script>

