<template>
    <router-link :to="'/question/' + questionDataValues.id" class="question-link" >
        <div class="question-item">

            <div class="upper-row">
                <div class="data-box" v-if="!hideUsername">
                    @{{ questionDataValues.author }}
                </div>
                <div class="data-box">
                    {{ questionDataValues.category }}
                </div>
                <div class="data-box">
                    {{ questionDataValues.date }}
                    at
                    {{ questionDataValues.time }}
                </div>
            </div>

            <div class="lower-row">
                <h2 class="question-text">
                    {{ questionDataValues.question }}
                </h2>

                <font-awesome-icon icon="fa fa-arrow-right" class="link-arrow" />
            </div>
            
        </div>
    </router-link>
</template>

<script setup>
    import { defineProps, ref } from 'vue';

    const props = defineProps(["questionData", "hideUsername"])
    const questionDataValues = ref(props.questionData)
    const hideUsername = ref(props.hideUsername)

</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";
    .question-link{
        text-decoration: none;
    }
    .question-item{
        background-color: $grey;
        padding: 2rem;
        margin-bottom: 2rem;
        cursor: pointer;
        transition: all 0.4s;
    }
    .link-arrow{
        font-size: 3rem;
        color: $purple;
        opacity: 0;
        transform: translateX(-14rem);
        transition: all 0.4s;
    }
    .question-item:hover{
        transform: translateX(2rem);
        border-left: 1rem solid $purple;
    }
    .question-item:hover .link-arrow{
        opacity: 1;
        transform: translateX(-4rem);
    }

    .upper-row, .lower-row{
        @include flex-row();
        justify-content: flex-start;
    }
    .data-box{
        background-color: $darkgrey;
        color: $purple;
        padding: 1rem;
        font-size: 1.4rem;
        margin-right: 1rem;
    }
    .lower-row{
        text-align: left;
        @include flex-row();
        justify-content: space-between;
        align-items: center;
    }
    .question-text{
        font-size: 3.5rem;
        color: $white;
        margin-top: 1rem;
    }

    @media(max-width: 860px){
        .data-box{
            font-size: 2vw;
        }
        .question-text{
            font-size: 4vw;
        }
    }
    @media(max-width: 600px){
        .question-item{
            padding: 1rem;
        }
    }
</style>