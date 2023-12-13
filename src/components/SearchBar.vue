<template>
    <div class="search-bar-container">
        <div class="input-container">
            <input type="text" placeholder="Search" v-model="searchQuery" @keypress.enter="handleSearch" >
            <div class="search-icon-container" @click="handleSearch" >
                <font-awesome-icon icon="fa fa-magnifying-glass" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter()

    let searchQuery = ref("")
    const handleSearch = () => {
        router.push('/search/' + searchQuery.value )
        searchQuery.value = ""
    }

</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";
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
            font-size: 2rem
        }
        .search-icon-container{
            @include flex-row();
            justify-content: center;
            align-items: center;
            color: $green;
            background-color: $darkgrey;
            cursor: pointer;
            transition: all 0.4s;
            font-size: 2rem;
        }
        .search-icon-container:hover{
            background-color: $green;
            color: $darkgrey;
        }
        
        input::placeholder{
            color: $green;
        }
    }

    @media(max-width: 1300px){
        .search-bar-container .input-container{
            max-width: 1000px;
            input, .search-icon-container{
                font-size: 1.8rem;
            }
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