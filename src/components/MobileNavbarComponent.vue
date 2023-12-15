<template>
    <nav class="mobile-navigation">

        <router-link to="/" class="link">
            <font-awesome-icon icon="fa fa-house"/>
        </router-link>

        <router-link to="/ask" class="link">
            <font-awesome-icon icon="fa fa-plus"/>
        </router-link>

        <button class="btn-link expand-list-btn" @click="expandList" v-if="!listVisible">
            <font-awesome-icon icon="fa fa-list" />
        </button>

        <button class="btn-link hide-list-btn" @click="hideList" v-if="listVisible">
            <font-awesome-icon icon="fa fa-xmark" />
        </button>

        <router-link :to="'/user/' + loggedInUserID" class="link" v-if="isLoggedIn">
            <font-awesome-icon icon="fa fa-user"/>
        </router-link>
        
        <button class="btn-link logout" @click="emitSignOut" v-if="isLoggedIn">
            <font-awesome-icon icon="fa fa-right-from-bracket"/>
        </button>

        <router-link to="/login" class="btn-link" v-if="!isLoggedIn">
            <font-awesome-icon icon="fa fa-right-to-bracket"/>
        </router-link>

    </nav>

    <div class="topic-list" v-if="listVisible" :class="{'show-list-animation': showListAnimationActive, 'hide-list-animation': hideListAnimationActive}">
        <router-link to="/topic/general" class="topic-list-item" @click="hideList" >General</router-link>
        <router-link to="/topic/technology" class="topic-list-item" @click="hideList">Technology</router-link>
        <router-link to="/topic/science" class="topic-list-item" @click="hideList">Science</router-link>
        <router-link to="/topic/philosophy" class="topic-list-item" @click="hideList">Philosophy</router-link>
        <router-link to="/topic/psychology" class="topic-list-item" @click="hideList">Psychology</router-link>
        <router-link to="/topic/geography" class="topic-list-item" @click="hideList">Geography</router-link>
        <router-link to="/topic/history" class="topic-list-item" @click="hideList">History</router-link>
    </div>
</template>

<script setup>
    
    import { defineEmits, ref, onMounted} from 'vue';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';

    const emits = defineEmits(['signOut'])

    let isLoggedIn = ref(null)
    let loggedInUserID = ref(null)

    let auth;
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

    let showListAnimationActive = ref(false)
    let listVisible = ref(false)
    const expandList = () => {
        listVisible.value = true
        showListAnimationActive.value = true
        
        setTimeout(() => {
            showListAnimationActive.value = false
        }, 500);
        
    }

    let hideListAnimationActive = ref(false)
    const hideList = () => {
        hideListAnimationActive.value = true
        setTimeout(() => {
            listVisible.value = false
            hideListAnimationActive.value = false
        }, 500);
    }

</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";
    .mobile-navigation{
        height: 10vh;
        width: 100%;
        background-color: $green;
        @include flex-row();
        justify-content: space-between;
        align-items: center;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 50;
        padding: 30px 50px;
    }
    .btn-link{
        background-color: transparent;
        font-size: 3rem;
        outline: 0;
        border: 0;
        cursor: pointer;
    }
    .btn-link, .link{
        color: $white;
        font-size: 3rem;
    }

    .topic-list{
        height: 90vh;
        width: 100%;
        position: fixed;
        background-color: $darkgrey;
        bottom: 10rem;
        right: 0;
        z-index: 40;
        @include flex-column();
        justify-content: center;
        align-items: center;
        .topic-list-item{
            color: $white;
            padding: 2rem;
            font-size: 3.2rem;
            text-decoration: none;
            color: $white;
            transition: color 0.2s;
        }
        .topic-list-item:hover{
            color: $green;
        }
    }

    .hide-list-btn{
        background-color: $purple;
        padding: 1rem;
        color: $darkgrey;
    }

    .show-list-animation{
        animation-name: showList;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
    }
    @keyframes showList{
        0%{transform: translateY(100%);}
        100%{transform: translateY(0);}
    }

    .hide-list-animation{
        animation-name: hideList;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-in;
    }
    @keyframes hideList{
        0%{transform: translateY(0);}
        100%{transform: translateY(100%);}
    }
</style>