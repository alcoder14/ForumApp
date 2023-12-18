<template>
    <section class="form-page-container">
        <form class="form-page-form">
            <div class="form-title-container">
                <h1 class="form-title">Login</h1>
            </div>
            <p class="form-error" v-if="errorMessage"> {{ errorMessage }} </p>
            <input type="text" placeholder="Email" class="form-input-dark" v-model="email">
            <input type="password" placeholder="Password" class="form-input-dark" v-model="password">
            <router-link to="/reset-password" class="forgot-password">Forgot Password?</router-link>
            <button type="button" class="form-submit" @click="signIn">Log In</button>
            <div class="form-alternative-container">Not a member?
                <router-link to="/register"><button class="form-alternative-btn" type="button">Register</button></router-link>
            </div>
        </form>
    </section>
</template>

<script setup>
    import { ref } from 'vue';
    import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
    import { useRouter } from 'vue-router';

    const router = useRouter()
    const errorMessage = ref("")

    const email = ref("")
    const password = ref("")

    const auth = getAuth()

    const signIn = () => {
        signInWithEmailAndPassword(auth, email.value, password.value)
        .then((data) =>{
            console.log(data)
            router.push("/")
        })
        .catch((error) => {
            console.log(error)
            switch(error.code){
                case "auth/invalid-email":
                    errorMessage.value = "Invalid email";
                    break;
                case "auth/user-not-found":
                    errorMessage.value = "User not found";
                    break;
                case "auth/wrong-password":
                    errorMessage.value = "Incorrect password";
                    break;
                default:
                    errorMessage.value = "Email or password was incorrect.";
                    break;
            }
        })
    }

</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";
    
    .forgot-password{
        margin-bottom: 1.2rem;
        align-self: flex-start;
        color: $green;
        font-size: 1.4rem;
        text-decoration: none;
    }



</style>