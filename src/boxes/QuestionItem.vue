<template>
    
        <div class="question-item">

            <div class="upper-row">
                <div class="upper-row-left">
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

                <button class="delete-question-btn tool-red" type="button" v-if="shownOnProfilePage && authorAuthenticated" @click="emitHideQuestion" >Delete</button>
                
            </div>

            <router-link :to="'/question/' + questionDataValues.id" class="question-link" >
                <div class="lower-row">
                    <h2 class="question-text">
                        {{ questionDataValues.question }}
                    </h2>

                    <font-awesome-icon icon="fa fa-arrow-right" class="link-arrow" />
                </div>
            </router-link>
        </div>

</template>

<script setup>
    import { defineProps, defineEmits, ref, onMounted } from 'vue';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';

    const props = defineProps(["questionData", "hideUsername", "shownOnProfilePage"])
    const questionDataValues = ref(props.questionData)
    const hideUsername = ref(props.hideUsername)
    const shownOnProfilePage = ref(props.shownOnProfilePage)

    let authorAuthenticated = ref(false)
    let auth
    onMounted(() => {
        auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if(user){

                if(user.uid === questionDataValues.value.authorID){
                    authorAuthenticated.value = true
                }

            } else {
                console.log("user not authenticated - question")
            }
        })
    })

    const emits = defineEmits(['hideQuestion'])

    // temporarily hide question

    const emitHideQuestion = () =>{
        emits("hideQuestion", questionDataValues.value.id)
    }


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
    /*
    .question-item:hover{
        transform: translateX(2rem);
        border-left: 1rem solid $purple;
    }
    .question-item:hover .link-arrow{
        opacity: 1;
        transform: translateX(-4rem);
    }
    */

    .data-box{
        background-color: $darkgrey;
        color: $purple;
        padding: 1rem;
        font-size: 1.4rem;
        margin-right: 1rem;
    }
    .upper-row, .lower-row{
        @include flex-row();
        justify-content: space-between;
    }
    .upper-row .upper-row-left{
        @include flex-row();
        justify-content: flex-start;
    }
    .delete-question-btn{
        align-self: center;
        padding: 1rem;
        border: 0;
        outline: 0;
        color: $white;
        cursor: pointer;
    }
    .lower-row{
        text-align: left;
        @include flex-row();
        align-items: center;
    }
    .question-text{
        font-size: 3.5rem;
        color: $white;
        margin-top: 1rem;
    }

    @media(max-width: 860px){
        .data-box, .delete-question-btn{
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