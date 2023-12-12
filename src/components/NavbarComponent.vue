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
                <button class="btn-link" @click="handleSignOut" v-if="isLoggedIn"><font-awesome-icon icon="fa fa-right-from-bracket"/></button>
                <router-link to="/login" class="btn-link link-margin" v-if="!isLoggedIn"><font-awesome-icon icon="fa fa-right-to-bracket"/></router-link>
            </div>
        </nav>

        <div class="search-bar-container">
            <div class="input-container">
                <input type="text" placeholder="Search" v-model="searchQuery" @keypress.enter="handleSearch" >
                <div class="search-icon-container" @click="handleSearch" >
                    <font-awesome-icon icon="fa fa-magnifying-glass" />
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
    import { collection, where, getDocs, query } from 'firebase/firestore';
    import { db } from '@/firebase';
    import { useRouter } from 'vue-router';

    let router = useRouter()
    let isLoggedIn = ref(false)
    let auth;

    onMounted(() =>{
        auth = getAuth()
        onAuthStateChanged(auth, (user) =>{
            if(user){
                isLoggedIn.value = true
                getLoggedInUserID(user.displayName)
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

    let searchQuery = ref("")
    const handleSearch = () => {
        router.push('/search/' + searchQuery.value )
        searchQuery.value = ""
    }

    let loggedInUserID = ref("")
    const getLoggedInUserID = async (username) => {

        console.log(username)
        
        const q = query(collection(db, "users"), where("username", "==", username))
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot)

        querySnapshot.forEach((doc) => {
            loggedInUserID.value = doc.id
        })

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
    .search-bar-container{
        width: 100%;
        border-top: 1px rgb(66, 66, 66) solid;
        background-color: $grey;
        .input-container{
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            padding: 10px 0;
            display: grid;
            grid-template-columns: 92% 8%;
        }
        input{
            width: inherit;
            padding: 6px 12px;
            outline: 0;
            border: 0;
            border-left: 3px solid $green;
            color: $green;
            background-color: $darkgrey;
            font-size: 2.2rem;
        }
        .search-icon-container{
            @include flex-row();
            justify-content: center;
            align-items: center;
            font-size: 2.2rem;
            color: $green;
            background-color: $darkgrey;
            cursor: pointer;
            transition: all 0.4s;
        }
        .search-icon-container:hover{
            background-color: $green;
            color: $darkgrey;
        }
        
        input::placeholder{
            color: $green;
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
        padding: 1rem;
        border-bottom: 0.3rem solid $green;
        background-color: $darkgrey;
        font-size: 2rem;
        color: $green;
        outline: 0;
        border-top: 0;
        border-left: 0;
        border-right: 0;
        cursor: pointer;
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
    @media(max-width: 1300px){
        .search-bar-container .input-container{
            max-width: 1000px;
        }
    }
    @media(max-width: 1200px){
        .navbar{
            display: none;
        }
    }
    @media(max-width: 1100px){
        .search-bar-container .input-container{
            max-width: 800px;
        }
    }
    @media(max-width: 860px){
        .search-bar-container .input-container{
            margin: 0 30px;
            max-width: 100%;
        }
    }
</style>