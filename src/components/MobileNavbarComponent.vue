<template>
    <nav class="mobile-navigation">

        <router-link to="/" class="link">
            <font-awesome-icon icon="fa fa-house"/>
        </router-link>

        <router-link to="/ask" class="link">
            <font-awesome-icon icon="fa fa-plus"/>
        </router-link>

        <button class="btn-link expand-list-btn">
            <font-awesome-icon icon="fa fa-list" />
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
</template>

<script setup>
    import { defineProps, defineEmits, ref } from 'vue';

    const emits = defineEmits(['signOut'])
    const props = defineProps(['IsLoggedIn', 'loggedInUserID'])

    const isLoggedIn = ref(props.IsLoggedIn)
    const loggedInUserID = ref(props.loggedInUserID)

    const emitSignOut = () => {
        emits('signOut')
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
        padding: 30px 50px;
    }
    .btn-link{
        background-color: transparent;
        font-size: 3rem;
        outline: 0;
        border: 0;
    }
    .btn-link, .link{
        color: $white;
        font-size: 3rem;
    }
</style>