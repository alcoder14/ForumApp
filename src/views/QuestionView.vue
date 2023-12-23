<template>
    <div class="outer-container">
      <div class="inner-container">

        <div class="question-content" v-if="questionDataRef">
          <router-link :to="'/topic/' + questionDataRef.category" class="question-content" >#{{  questionDataRef.category }} </router-link>
          <h1 class="question-title">{{ questionDataRef.question }}</h1>

          <p class="question-metadata">Asked by <router-link :to="'/user/' + questionDataRef.authorID" class="link link-purple"> @{{ questionDataRef.author }}</router-link> on {{ questionDataRef.date }} at {{ questionDataRef.time }} </p>
          <p class="question-description">{{ questionDataRef.description }}</p>
        </div>

        <div class="line"></div>

        <div class="tools-multiple-container container-margin-top">
          <div class="tools-left-side">
            <h1 class="title answers-number" v-if="answers.length > 0">{{ answers.length }} answers</h1>
            <button class="tool tool-green" v-if="userLoggedIn && !mobileView" @click="toggleAnswerForm"> <font-awesome-icon icon="fa-solid fa-pen-to-square" /> Answer</button>
          </div>
          <div class="tools-right-side">
            <label for="sort" class="label">Sort: </label>
            <select id="sort" class="dropdown" v-model="sort" @change="callSortItems">
              <option value="oldest">Oldest</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        <div class="answer-form-container" v-if="answerFormVisible">
          <AnswerForm :questionID="questionID" :question="questionDataRef.question" :username="activeUser" :userID="activeUserID" :showDiscardBtn="true" @closeForm="toggleAnswerForm" />
        </div>
        
        <div class="answers-container" v-if="answers.length > 0">
          <AnswerItem v-for="answer in answers" :key="answer.id" :answerData="answer" :showQuestion="false" />
        </div>

        <NoAnswers v-else />

        <button class="mobile-answer-btn" @click="toggleMobileForm" v-if="mobileView" ><font-awesome-icon icon="fa fa-pen" /></button>

      </div>
    </div>

    <MobileAnswerModalVue v-if="mobileForm" :questionID="questionID" :username="activeUser" :userID="activeUserID" :questionText="questionDataRef.question" @closeModal="toggleMobileForm" />
  </template>
  
  <script setup>
  import { onMounted, ref} from 'vue';
  import { useRoute } from 'vue-router';
  import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
  import { db } from '@/firebase';
  import { onAuthStateChanged, getAuth } from 'firebase/auth';
  import AnswerItem from '@/boxes/AnswerItem.vue';
  import MobileAnswerModalVue from '@/modals/MobileAnswerModal.vue'
  import AnswerForm from '@/components/AnswerForm.vue';
  import NoAnswers from '@/components/NoAnswers.vue';
  import { sortItems } from '@/methods';


  // Authenticate User
  let auth = getAuth();

  let userLoggedIn = false
  let activeUser = ""
  let activeUserID = null

  onAuthStateChanged(auth, (user)=>{
    if(user){
      userLoggedIn = true
      activeUser = user.displayName
      activeUserID = user.uid
      console.log(user)
    }
  })

  // Test Screen Size
  let mobileView = ref(false)
  const testScreenSize = () =>{
    if(window.innerWidth <= 860){
      mobileView.value = true
      answerFormVisible.value = false
    } else {
      mobileView.value = false
      mobileForm.value = false
    }
  }

  window.addEventListener("resize", testScreenSize);
  
  // Variables
  const route = useRoute();
  
  let sort = ref("oldest")
  let questionID = "";
  let questionDataRef = ref(null);
  let answerFormVisible = ref(false);

  let answers = ref([])
  //let oldestAnswersFirst = []
  //let newestAnswersFirst = []

  let answersCollectionRef = collection(db, "answers")
  
  onMounted(async () => {

    // Test Screen Size
    testScreenSize();

    // Get ID of the question
    questionID = route.params.id;
    await getQuestion(questionID);

    // Get Answers For The Question
    onSnapshot(answersCollectionRef, (querySnapshot)=>{

      let firebaseAnswers = []
      querySnapshot.forEach((doc) => {

        if(doc.data().questionID === questionID){
          const answerData = {
            id: doc.id,
            answer: doc.data().answer,
            date: doc.data().date,
            time: doc.data().time,
            author: doc.data().author,
            authorID: doc.data().authorID
          }
          firebaseAnswers.push(answerData)
        }

      })


      answers.value = sortItems(firebaseAnswers, sort.value)

    })

  });

  const callSortItems = () => {
    answers.value = sortItems(answers.value, sort.value)
  }

  
  // Get Question from firebase
  const getQuestion = async (id) => {
    const questionRef = doc(db, "questions", id);
    const questionData = await getDoc(questionRef);
  
    if (questionData.exists()) {
      questionDataRef.value = questionData.data();
    } else {
      console.error("Question not found!");
    }
  };

  // Toggle VIsibility of the answer form
  const toggleAnswerForm = () => {
    answerFormVisible.value = !answerFormVisible.value
  }

  // Toggle Mobile Answer Form
  let mobileForm = ref(false) 
  const toggleMobileForm = () =>{
    mobileForm.value = !mobileForm.value
  }


  </script>
  
  <style lang="scss" scoped>
  @import "@/assets/style.scss";

    .question-content{
      text-align: left;
      font-size: 1.6rem;
      color: $purple; 
    }
    .question-title{
      font-size: 4.5rem;
      color: $darkpurple;
      margin-top: 1.2rem;
    }
    .question-metadata{
      font-size: 1.6rem;
      color: $purple;
      margin-top: 1.2rem;
    }
    .question-description{
      font-size: 2rem;
      color: $white;
      margin-top: 1.2rem;
    }
    .line{
      background-color: #4b4b4b;
      height: 0.6rem;
      width: 100%;
      margin-top: 1.2rem;
    }
    

    /* Mobile View Button */

    .mobile-answer-btn{
        position: fixed;
        bottom: 120px;
        right: 30px;
        z-index: 10;
        background-color: $darkpurple;
        color: $darkgrey;
        padding: 15px;
        font-size: 2rem;
        border: 0;
        outline: 0;
        cursor: pointer;
    }

    @media(max-width: 860px){
      .question-title{
        font-size: 6vw;
      }
      .question-metadata{
        font-size: 2vw;
      }
      .question-description{
        font-size: 3.5vw;
      }
      .tools-left-side{
        .title{
          font-size: 3vw;
        }
      }
      .tools-right-side{
        .label{
          margin-right: 1rem;
          font-size: 3vw;
        }
      }

    }
  </style>
  