<template>
  <!-- Show Navbar with router-view -->
  <NavbarComponent v-if="showNavbar && visibleNavbar === 'desktop'" :loggedInUserID="loggedInUserID" :IsLoggedIn="isLoggedIn" />
  <SearchBar v-if="showNavbar" />
  <MobileNavbarComponent v-if="showNavbar && visibleNavbar === 'mobile' " @signOut="handleSignOut" :loggedInUserID="loggedInUserID" :IsLoggedIn="isLoggedIn" />

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
  const pagesWithoutNavbar = ['/login', '/register'];

  const showNavbar = computed(()=>{
    if(pagesWithoutNavbar.includes(route.path)){
      return false
    } else {
      return true
    }
  })

  let visibleNavbar = ref(null)

  const checkWidth = () => {
    if(window.innerWidth > 860){
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

  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  import { useRouter } from 'vue-router';

  let router = useRouter()
  let isLoggedIn = ref(false)
  let auth;

  let loggedInUserID = ref("")
  onMounted(() =>{
      auth = getAuth()
      onAuthStateChanged(auth, (user) =>{
          if(user){
              isLoggedIn.value = true
              loggedInUserID = user.uid
          } else {
              isLoggedIn.value = false
          }
      })

  })

  const handleSignOut = () =>{
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
