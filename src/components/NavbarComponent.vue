<template>
    <div class="navbar-searchbar-container">
        <nav class="navbar">
            <div class="left navbar-section">
                <router-link to="/" class="btn-link"><font-awesome-icon icon="fa fa-house"/></router-link>
            </div>
            <div class="center navbar-section">
                <router-link to="/topic/general" class="link" >General</router-link>
                <router-link to="/topic/technology" class="link">Technology</router-link>
                <router-link to="/topic/science" class="link">Science</router-link>
                <router-link to="/topic/philosophy" class="link">Philosophy</router-link>
                <router-link to="/topic/psychology" class="link">Psychology</router-link>
                <router-link to="/topic/geography" class="link">Geography</router-link>
                <router-link to="/topic/history" class="link">History</router-link>
            </div>
            <div class="right navbar-section">
                <router-link to="/ask" class="btn-link link-margin"><font-awesome-icon icon="fa fa-plus"/></router-link>

                <router-link :to="'/user/' + loggedInUserID" class="btn-link link-margin" v-if="isLoggedIn"><font-awesome-icon icon="fa fa-user"/></router-link>
                <button class="btn-link" @click="emitSignOut" v-if="isLoggedIn"><font-awesome-icon icon="fa fa-right-from-bracket"/></button>
                <router-link to="/login" class="btn-link link-margin" v-if="!isLoggedIn"><font-awesome-icon icon="fa fa-right-to-bracket"/></router-link>
            </div>
        </nav>
    </div>
</template>

<script setup>
    import { defineEmits, ref, onMounted} from 'vue';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';

    const emits = defineEmits(['signOut'])

    let isLoggedIn = ref(null)
    let loggedInUserID = ref(null)

    let auth
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

    const emitSignOut = () => {
        emits('signOut')
    }

    
</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";

    .navbar{
        height: 8vh;
        width: 100%;
        background-color: $grey;
        @include flex-row();
        .navbar-section{
            @include flex-row();
            align-items: center;
        }
        .left{
            width: 30%;
            @include flex-row();
            justify-content: flex-start;
        }
        .right{
            width: 30%;
            @include flex-row();
            justify-content: flex-end;
        }
        .center{
            width: 40%;
            @include flex-row();
            justify-content: center;
        }
    }

    .link{
        font-size: 2rem;
        color: white;
        text-decoration: none;
        padding: 2rem;
        font-weight: lighter;
    }
    .link-margin{
        margin-right: 20px;
    }
    .btn-link{
        height: 5rem;
        width: 5rem;
        @include flex-row();
        justify-content: center;
        align-items: center;
        border-bottom: 0.3rem solid $green;
        background-color: $darkgrey;
        font-size: 2rem;
        color: $green;
        outline: 0;
        border-top: 0;
        border-left: 0;
        border-right: 0;
        cursor: pointer;
        transition: all 0.4s;
    }
    .btn-link:hover{
        background-color: $green;
        border-bottom: $darkgrey 0.3rem solid;
        color: $darkgrey;
    }

    @media(max-width: 1400px){
        .navbar{
            height: 7vh;
        }
        .link, .btn-link{
            font-size: 2rem;
        }
        .link{
            padding: 1.6rem;
        }
        .link-margin{
            margin-right: 12px;
        }
    }
    /*
    @media(max-width: 1200px){
        .navbar{
            display: none;
        }
    }
    */
</style>