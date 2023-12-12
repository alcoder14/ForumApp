<template>
    <div class="answer">

        <router-link :to="'/question/' + answerDataValues.questionID" v-if="showQuestionValue" class="link link-green"> <h2 class="parent-question">{{ answerDataValues.question }}</h2> </router-link>

        <router-link :to="'/user/' + answerDataValues.authorID " v-else class="link link-green">
            <h2 class="answer-author"> @{{ answerDataValues.author }}</h2>
        </router-link>

        <h4 class="answer-datetime">{{ answerDataValues.date }} at {{ answerDataValues.time }}</h4>
        <p class="answer-content">{{ answerDataValues.answer }}</p>
    </div>
</template>

<script setup>

    import { defineProps, ref } from 'vue';

    const props = defineProps(['answerData', 'showQuestion'])
    const answerDataValues = ref(props.answerData)
    const showQuestionValue = ref(props.showQuestion)

    console.log(answerDataValues.value)

</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";

    .answer{
        margin-top: 1.2rem;
        background-color: $grey;
        text-align: left;
        padding: 2rem;
    }
    .answer-author{
        color: $green;
        font-size: 2.3rem;
        font-weight: lighter;
    }
    .parent-question{
        font-size: 3rem;
    }
    .answer-datetime{
        color: #b4b4b4;
        margin-top: 1rem;
        font-weight: lighter;
        font-size: 1.4rem;
    }
    .answer-content{
        margin-top: 1rem;
        color: $white;
        font-size: 2.5rem;
    }
</style>