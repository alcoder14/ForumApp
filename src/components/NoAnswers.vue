<template>
    <div class="no-answers-container">
        <font-awesome-icon icon="fa fa-pen" class="pen-icon" />
        <h1>No Answers</h1>
    </div>    
</template>

<style lang="scss" scoped>
    @import "@/assets/style.scss";
    .no-answers-container{
        width: 100%;
        height: 35vh;
        background-color: $grey;
        @include flex-column();
        justify-content: center;
        align-items: center;
        margin-top: 2rem;
        .pen-icon{
            font-size: 1.5rem;
            margin: 1rem;
            color: $green;
        }
        h1{
            font-size: 2rem;
            color: $white;
        }
    }
</style>