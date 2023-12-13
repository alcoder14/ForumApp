<template>
    <div class="modal-container">
        <button class="close-modal-btn"><font-awesome-icon icon="fa fa-xmark" @click="emitCloseModal" /></button>
        <h2 class="question-text">{{ questionText }}</h2>
        <AnswerForm :questionID="questionID" :question="question" :username="activeUser" :userID="activeUserID" :showDiscardBtn="false" @closeModal="emitCloseModal" />
    </div>
</template>

<script setup>
    import AnswerForm from '@/components/AnswerForm.vue';
    import { defineProps, defineEmits, ref } from 'vue';

    const props = defineProps(['questionID', 'question', 'username', 'userID', 'questionText'])
    let questionID = ref(props.questionID)
    let activeUser = ref(props.username)
    let activeUserID = ref(props.activeUserID)
    let questionText = ref(props.questionText)
    let question = ref(props.question)

    const emits = defineEmits(['closeModal'])

    const emitCloseModal = () => {
        emits("closeModal")
    }

</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";
    .close-modal-btn{
        background: transparent;
        outline: 0;
        border: 0;
        margin: 30px;
        font-size: 3rem;
        color: $white;
        cursor: pointer;
    }
    .question-text{
        font-size: 3rem;
        color: $green;
        padding: 0 30px;
        text-align: left;
    }
</style>