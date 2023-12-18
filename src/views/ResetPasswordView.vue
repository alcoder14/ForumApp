<template>
    <div class="form-page-container">
        <form class="form-page-form">
            <div class="form-title-container">
                <h1 class="form-title">Reset Password</h1>
            </div>
            <p class="form-error" v-if="errorMessage"> {{ errorMessage }} </p>
            <input type="text" placeholder="Email associated with you account" class="form-input-dark" v-model="email" v-if="!emailSent">
            <button type="button" class="form-submit" @click="resetPassword" v-if="!emailSent">Reset Password</button>

            <p v-if="emailSent" class="password-sent">Check your email to reset your password.</p>
            <router-link to="/login" class="login-link" v-if="emailSent">Login</router-link>
        </form>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

    let email = ref("")
    let errorMessage = ref("")
    let emailSent = ref(false)

    const resetPassword = () => {

        email.value = email.value.trim()
        if(email.value === ""){
            errorMessage.value = "Please enter your email"
            return;
        }

        sendPasswordResetEmail(getAuth(), email.value)
            .then(()=>{
                console.log("Password reset email sent");
                errorMessage.value = false
                emailSent.value = true
            }).catch((error)=> {
                console.log(error)
                errorMessage.value = "This email does not exist";
            })
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";
    .password-sent, .login-link{
        font-size: 2rem;
        text-align: left;
    }
    .password-sent{
        color: $white;
        margin-bottom: 2rem;
    }
    .login-link{
        color: $purple;
        text-decoration: none;
    }
</style>