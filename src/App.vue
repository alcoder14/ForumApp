<template>
  <!-- Show Navbar with router-view -->
  <NavbarComponent v-if="showNavbar && visibleNavbar === 'desktop'" @signOut="handleSignOut" />
  <SearchBar v-if="showNavbar" @signOut="handleSignOut" />
  <MobileNavbarComponent v-if="showNavbar && visibleNavbar === 'mobile' " @signOut="handleSignOut" />

  <!-- Show only router-view -->
  <router-view :key="route.params"/>
</template>

<script setup>
  import NavbarComponent from './components/NavbarComponent.vue';
  import MobileNavbarComponent from './components/MobileNavbarComponent.vue';
  import SearchBar from './components/SearchBar.vue';

  import { computed, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';

  // NAVBARS LOGIC

  const route = useRoute()
  const pagesWithoutNavbar = ['/login', '/register', '/reset-password'];

  const showNavbar = computed(()=>{
    if(pagesWithoutNavbar.includes(route.path)){
      return false
    } else {
      return true
    }
  })

  let visibleNavbar = ref(null)

  const checkWidth = () => {
    if(window.innerWidth > 1250){
      visibleNavbar.value = "desktop"
    } else {
      visibleNavbar.value = "mobile"
    }
  }

  onMounted(() => {
    checkWidth()
    window.addEventListener("resize", checkWidth)
  })

  // Check If user is logged in 

  import { getAuth,  signOut } from 'firebase/auth';
  import { useRouter } from 'vue-router';

  let router = useRouter()
  let auth = getAuth();

  const handleSignOut = () =>{
    console.log("hello 2")
    signOut(auth)
        .then(() => {
            router.push("/")
        })
  }



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
