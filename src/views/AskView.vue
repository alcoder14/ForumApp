<template>
    <div class="outer-container">
        <div class="inner-container">
            <div class="tools-single-container">
                <h1 class="title">Ask Question</h1>
            </div>

            <form class="form-container container-margin-top" @submit.prevent="submitForm">
                <input type="text" placeholder="Question" class="form-input-light question-input" v-model="question" :class="{'input-error': errMessageQuestion !== null}">


                <select class="dropdown" v-model="category">
                    <option value="general">general</option>
                    <option value="philosophy">philosophy</option>
                    <option value="science">science</option>
                    <option value="technology">technology</option>
                    <option value="psychology">pyschology</option>
                    <option value="geography">geography</option>
                    <option value="history">history</option>
                </select>

                <p class="errMessage" v-if="errMessageQuestion !== null">{{ errMessageQuestion }}</p>

                <textarea rows="15" placeholder="Description" class="form-input-light description-input" v-model="description"></textarea>
                <button type="submit" class="form-submit submit-question-btn">Submit</button>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    
    import { db } from '@/firebase';
    import { collection, addDoc } from "firebase/firestore"
    import { useRouter } from 'vue-router';
    import { getDate, getTime } from '@/methods';
    
    const auth = getAuth();
    
    let activeUser = ""
    let activeUserID = ""
    onAuthStateChanged(auth, (user) => {
        if(user){
            activeUser = user.displayName
            activeUserID = user.uid
        }
    })
    

    let question = ref("")
    let description = ref("")
    let category = ref("general")

    let errMessageQuestion = ref(null)
    let router = useRouter()

    // SUBMIT FORM
    const submitForm = async () => {

        validateQuestion();

        let date = getDate()
        let time = getTime()
        
        const questionRef = await addDoc(collection(db, "questions"), {
            author: activeUser,
            category: category.value,
            date: date,
            description: description.value,
            question: question.value,
            time: time,
            authorID: activeUserID
        });
        
        router.push("/question/" + questionRef.id)

    }

    const validateQuestion = () => {

        errMessageQuestion.value = null

        // Remove all spaces
        question.value = question.value.trim();
        if(question.value === ""){
            errMessageQuestion.value = "Enter a valid question"
            return;
        }

        // Add Question mark if it does not exist
        if(question.value[question.value.length - 1] !== "?"){
            question.value += "?"
        }
    }

</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";

    .form-container{
        display: grid;
        grid-template-columns: 80% 20%;
    }
    .description-input{
        grid-column: 1 / span 2;
        resize: vertical;
    }
    .question-input{
        margin-right: 2rem;
    }
    .submit-question-btn{
        grid-column: 1 / span 2;
        justify-self: end;
        width: 20%;
    }
    @media(max-width: 660px){
        .form-container{
            grid-template-columns: 100%;
        }
        .description-input, .submit-question-btn{
            grid-column: unset;
        }
        .question-input{
            margin-right: 0;
        }

    }
</style>