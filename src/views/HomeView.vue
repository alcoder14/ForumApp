<template>
  <div class="outer-container">
    <div class="inner-container">
      <div class="tools-multiple-container">
        <h1 class="title">Latest</h1>
        <router-link to="/ask" v-if="isLoggedIn">
          <button class="create-post-btn tool tool-green"><font-awesome-icon icon="fa fa-plus" class="icon-margin-right" />Ask Question</button>
        </router-link>
      </div>
      <div class="questions-container">
        <QuestionItem v-for="question in questions" :key="question.id" :questionData="question"/>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, } from 'vue'
  import QuestionItem from '@/boxes/QuestionItem.vue';
  import { collection, onSnapshot} from 'firebase/firestore'
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { db } from '@/firebase'
  import { sortItems } from '@/methods';

  const questionsCollectionRef = collection(db, "questions")

  let questions = ref([])
  let auth;
  let isLoggedIn = false

  onMounted(() =>{

    auth = getAuth()
    onAuthStateChanged(auth, (user) =>{
      if(user){
        isLoggedIn = true
      } else {
        isLoggedIn = false
      }
    })
    
    onSnapshot(questionsCollectionRef, (querySnapshot)=>{
      let firebaseQuestions = []

      querySnapshot.forEach((doc) => {
        const questionData = {
          id: doc.id,
          question: doc.data().question,
          author: doc.data().author,
          date: doc.data().date,
          time: doc.data().time,
          category: doc.data().category
        }
        
        firebaseQuestions.push(questionData)
      })

      questions.value = sortItems(firebaseQuestions, "newest")
    })

  })
</script>

<style lang="scss" scoped>
  @import "@/assets/style.scss";

  .questions-container{
    margin-top: 4rem;
  }
</style>
