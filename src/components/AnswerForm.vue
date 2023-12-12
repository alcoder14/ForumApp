<template>
    <form class="answer-form">
        <textarea cols="30" rows="10" placeholder="Write your answer" class="form-input-dark" :class="{'input-error': errorMsg !== ''}" style="width: 100%;" v-model="newAnswer"></textarea>
        <p class="errMessage" v-if="errorMsg !== ''">{{ errorMsg }}</p>
        <div class="answer-form-buttons-container">
            <button class="tool tool-red discard-btn" type="button" @click="emitEvents" v-if="showDiscardBtn">Discard</button>
            <button class="tool tool-green confirm-btn" type="button" @click="postAnswer">Confirm</button>
        </div>
    </form>
</template>

<script setup>

    import { addDoc, collection } from 'firebase/firestore';
    import { db } from '@/firebase';
    import { getDate, getTime } from '@/methods';
    import { ref } from 'vue';
    import { defineEmits, defineProps } from 'vue'

    let newAnswer = ref("")
    let errorMsg = ref("")

    const props = defineProps(['questionID', 'question', 'username', 'userID', 'showDiscardBtn'])

    let questionID = ref(props.questionID)
    let question = ref(props.question)
    let authorUsername = ref(props.username)
    let authorID = ref(props.userID)
    let showDiscardBtn = ref(props.showDiscardBtn)

    // First one is for desktop form and second is for mobile form (here, form is in modal window)
    const emits = defineEmits(['closeForm', 'closeModal'])

    const postAnswer = async () => {

        // Reset All Values
        errorMsg.value = ""
        newAnswer.value = newAnswer.value.trim()

        // Validate Form
        if(newAnswer.value === ""){
        errorMsg.value = "Please write your answer";
        return;
        }

        // Construct Answer Object
        let date = getDate()
        let time = getTime()

        let answerData = {
            answer: newAnswer.value,
            date: date,
            time: time,
            questionID: questionID.value,
            question: question.value,
            author: authorUsername.value,
            authorID: authorID.value
        } 

        // Post Answer
        const answerRef = await addDoc(collection(db, "answers"), answerData)
        console.log(answerRef)

        // Close the Form
        emitEvents()
}

const emitEvents = () => {
    newAnswer.value = ""
    emits("closeForm")
    emits("closeModal")
}

</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";

    /* Answer Form  */
    .answer-form{
      padding: 20px;
      background-color: $grey;
      margin-bottom: 5rem;
    }
    .answer-form-buttons-container{
      @include flex-row();
      justify-content: flex-end;
    }
    .discard-btn{
      margin-right: 2rem;
    }

    @media(max-width: 860px){
        .answer-form-buttons-container{
            @include flex-column();
            justify-content: unset;
        }
        .discard-btn, .confirm-btn{
            width: 100%;
        }
    }
</style>