<template>
  <div class="outer-container">
    <div class="inner-container">
      <div class="tools-multiple-container width-100">

        <!-- If user is logged in, render switch buttons, otherwise not -->

        <h1 class="title" v-if="!isLoggedIn">Latest</h1>
        <div class="switch-buttons" v-if="isLoggedIn" >
            <button class="switch-btn left-btn" @click="getLatestQuestions" :class="{'chosen-btn': visibleQuestions == 'latest'}" >Latest</button>

            <button class="switch-btn right-btn" @click="getFeedQuestions" :class="{'chosen-btn': visibleQuestions == 'feed'}">Feed</button>
        </div>

        <!-- If user is logged in, enable option to ask question -->

        <router-link to="/ask" v-if="isLoggedIn" class="ask-question-btn">
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
  import { collection, query, where, getDocs} from 'firebase/firestore'
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { db } from '@/firebase'
  import { sortItems } from '@/methods';
  
  let auth;
  let isLoggedIn = false
  let authenticatedUserUID = ref(null)

  auth = getAuth()
  onAuthStateChanged(auth, (user) =>{
      if(user){
        isLoggedIn = true
        authenticatedUserUID.value = user.uid
      } else {
        isLoggedIn = false
      }
  })

  onMounted(() =>{
    getLatestQuestions()
  })

  let visibleQuestions = ref("latest")

  
  let questions = ref([])

  const getLatestQuestions = async () =>{

    visibleQuestions.value = "latest"

    let latestQuestionsFirebase = []

    const q = query(collection(db, "questions"))
    const latestQuestionsRef = await getDocs(q)

    latestQuestionsRef.forEach((doc) => {
      const questionData = {
          id: doc.id,
          question: doc.data().question,
          author: doc.data().author,
          date: doc.data().date,
          time: doc.data().time,
          category: doc.data().category
        }

        latestQuestionsFirebase.push(questionData)
    })

    questions.value = sortItems(latestQuestionsFirebase, "newest")

  }


  const getFeedQuestions = async () => {

    visibleQuestions.value = "feed";

    // GET IDs of the profiles the user follows
    const followedUsersIDs = [];
    const qFollowers = query(collection(db, "followers"), where("followerID", "==", authenticatedUserUID.value));
    const followedUsers = await getDocs(qFollowers);

    followedUsers.forEach((doc) => {
      followedUsersIDs.push(doc.data().followedUserID);
    });

    // Use the IDs to fetch questions asked by associated users
    let feedQuestionsFirebase = [];

    await Promise.all(
      followedUsersIDs.map(async (userID) => {
        const qQuestions = query(collection(db, "questions"), where("authorID", "==", userID));
        const feedQuestionsRef = await getDocs(qQuestions);

        feedQuestionsRef.forEach((doc) => {
          const questionData = {
            id: doc.id,
            question: doc.data().question,
            author: doc.data().author,
            date: doc.data().date,
            time: doc.data().time,
            category: doc.data().category,
          };

          feedQuestionsFirebase.push(questionData);
        });
      })
    );

    console.log(feedQuestionsFirebase);
    questions.value = sortItems(feedQuestionsFirebase, "newest");
    console.log(questions.value);
};


</script>

<style lang="scss" scoped>
  @import "@/assets/style.scss";

  @media(max-width: 700px){
    .width-100{
      width: 100%;
      @include flex-column();
    }
    .ask-question-btn{
      margin-top: 3rem;
      align-self: flex-end;
    }
  }
</style>
