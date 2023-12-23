<template>
    <div class="modal-container">
        <form class="mobile-settings-form">

            <div class="upper-row">
                <h1 class="update-profile-title">Update Profile</h1>
                <button type="button" class="close-btn" @click="emitClose">
                    <font-awesome-icon icon="fa fa-xmark" />
                </button>
            </div>

            <label for="username">Username: </label>
            <input type="text" v-model="username" class="input form-input-dark" id="username">
            <label for="fullname">Full name: </label>
            <input type="text" v-model="fullname" class="input form-input-dark" id="fullname">
            <button type="button" @click="emitNewData" class="form-submit">Update</button>
        </form>
    </div>
</template>

<script setup>
    import { defineProps, ref, defineEmits } from 'vue';

    const props = defineProps(['username', 'fullname']);

    let username = ref(props.username)
    let fullname = ref(props.fullname)

    console.log(username)
    console.log(fullname)

    const emits = defineEmits(['closeModal', 'updateUserData'])

    const emitClose = () => {
        emits('closeModal')
    }

    const emitNewData = () => {
        emits('updateUserData', username.value, fullname.value)
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";

    .mobile-settings-form{
        width: 600px;
        margin-left: auto;
        margin-right: auto;
        height: inherit;
        @include flex-column();
        justify-content: center;
        align-items: center;
    }
    .upper-row{
        margin-bottom: 2rem;
    }

    .update-profile-title{
        font-size: 3rem;
        color: $darkpurple;
    }
    .close-btn{
        background-color: $purple;
        outline: 0;
        border: 0;
        height: 3rem;
        width: 3rem;
        cursor: pointer;
    }

    .input, .form-submit{
        width: 100%;
    }

    label{
        align-self: flex-start;
        color: $white;
        font-size: 1.6rem;
        margin-bottom: 0.6rem;
    }

    @media(max-width: 670px){
        .mobile-settings-form{
            width: 100%;
            margin: 0;
            padding: 30px;
        }
    }
    .upper-row{
        width: 100%;
        @include flex-row();
        justify-content: space-between;
        align-items: center;
    }
</style>