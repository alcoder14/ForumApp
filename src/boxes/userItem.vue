<template>
    <router-link :to="'/user/' + userID " class="link">
        <div class="user-box">
            <div class="icon-container">
                <font-awesome-icon icon="fa fa-user" />
            </div>
            <h1 class="username">@{{ username }}</h1>
        </div>
    </router-link>
</template>

<script setup>
    import { defineProps, ref } from 'vue';

    const props = defineProps(['username', 'userID'])
    const username = ref(props.username)
    const userID = ref(props.userID)

</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";
    .user-box{
        background-color: $grey;
        padding: 2rem;
        @include flex-column();
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border: 1px solid $grey;
        transition: border 0.4s;
    }
    .user-box:hover{
        border: 1px solid $green;
    }
    .icon-container{
        height: 8rem;
        width: 8rem;
        @include flex-row();
        justify-content: center;
        align-items: center;
        background-color: $darkgrey;
        color: $purple;
        margin: 1rem;
        font-size: 4rem;
        border-radius: 50%;
    }
    .username{
        font-size: 3rem;
        margin-top: 1rem;
        color: $green;
    }

    @media(max-width: 1300px){
        .username{
            font-size: 2rem;
        }
    }
</style>