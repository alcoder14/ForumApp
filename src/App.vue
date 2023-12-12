<template>
  <!-- Show Navbar with router-view -->
  <NavbarComponent v-if="showNavbar" />
  <!-- Show only router-view -->
  <router-view :key="route.params"/>
</template>

<script setup>
  import NavbarComponent from './components/NavbarComponent.vue';

  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute()
  const pagesWithoutNavbar = ['/login', '/register'];

  const showNavbar = computed(()=>{
    if(pagesWithoutNavbar.includes(route.path)){
      return false
    } else {
      return true
    }
  })


</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
