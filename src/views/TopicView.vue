<template>
    <div class="outer-container">
        <div class="inner-container">

            <div class="tools-multiple-container">
                <div class="tools-left-side">
                    <h1 class="title"> {{ topicQuestions.length }} Results in {{ topicName }}</h1>
                </div>
                <div class="tools-right-side">
                    <label for="sort" class="label">Sort: </label>
                    <select id="sort" class="dropdown" v-model="sort" @change="callSortItems">
                    <option value="oldest">Oldest</option>
                    <option value="newest">Newest</option>
                    </select>
                </div>
            </div>

            <div class="questions-container">
                <QuestionItem v-for="question in topicQuestions" :key="question.id" :questionData="question" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useRoute } from 'vue-router';
    import { ref, onMounted } from 'vue';
    import { onSnapshot, collection } from 'firebase/firestore';
    import { db } from '@/firebase';
    import QuestionItem from '@/boxes/QuestionItem.vue';
    import { sortItems } from '@/methods';

    const questionsCollectionRef = collection(db, "questions")

    const route = useRoute();
    const topicName = ref(route.params.topic)

    let topicQuestions = ref([])
    let sort = ref("oldest")

    onMounted(() => {

        onSnapshot(questionsCollectionRef, (querySnapshot)=> {
            let topicQuestionsFirebase = []

            querySnapshot.forEach((doc) => {
                if(doc.data().category === topicName.value){

                    const questionData = {
                        id: doc.id,
                        question: doc.data().question,
                        author: doc.data().author,
                        date: doc.data().date,
                        time: doc.data().time,
                        category: doc.data().category
                    }
                    
                    topicQuestionsFirebase.push(questionData)
                }

            })

            topicQuestions.value = sortItems(topicQuestionsFirebase, sort.value)
        })
    })

    const callSortItems = () => {
        topicQuestions.value = sortItems(topicQuestions.value, sort.value)
    }

</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";
</style>