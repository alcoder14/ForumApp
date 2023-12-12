<template>
    <section class="form-page-container">
        <form class="form-page-form">
            <div class="form-title-container">
                <h1 class="form-title">Register</h1>
            </div>

            <input type="text" placeholder="Email" class="form-input-dark" v-model="email">
            <input type="text" placeholder="Username" class="form-input-dark" v-model="displayName">
            <input type="text" placeholder="Full Name" class="form-input-dark" v-model="fullName">
            <input type="password" placeholder="Password" class="form-input-dark" v-model="password">

            <button type="button" class="form-submit" @click="register">Register</button>
            <div class="form-alternative-container">Already a member? 
                <router-link to="/login"><button class="form-alternative-btn" type="button">Log in</button></router-link>
            </div>
        </form>
    </section>
</template>

<script setup>
    import { ref } from 'vue';
    import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
    import { useRouter } from 'vue-router';
    import { getDate } from '@/methods';
    import { collection, doc, setDoc } from 'firebase/firestore';
    import { db } from '@/firebase';

    const router = useRouter()

    const email = ref("")
    const password = ref("")
    const displayName = ref("")
    const fullName = ref("")

    let newUserUID = null;

    const register = () =>{
        createUserWithEmailAndPassword(getAuth(), email.value, password.value)
            .then((data)=>{
                console.log(data)
                newUserUID = data.user.uid
                setDisplayName()
                saveNewUser()
                router.push("/")
            })
            .catch((error) =>{
                console.log(error)
            })
    }

    const setDisplayName = () => {
        updateProfile(getAuth().currentUser, { displayName: displayName.value })
            .then(() => {
                // Profile updated successfully
                console.log('User profile updated successfully');
            })
            .catch((error) => {
                // An error occurred
                console.error('Error updating user profile:', error.message);
            });
    }

    /* Save New User Into Firestore */

    const saveNewUser = async () => {
        let newUser = {
            email: email.value,
            fullName: fullName.value,
            memberSince: getDate(),
            username: displayName.value
        }
        email.value = ""
        password.value = ""

        const newUserRef = doc(collection(db, "users"), newUserUID)

        const newProfile = await setDoc(newUserRef, newUser)
        console.log(newProfile)

    }


</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";
</style>