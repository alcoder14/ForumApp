<template>
    <div class="outer-container">
        <div class="inner-container grid-view">

            <div class="user-data-container">
                <div class="user-icon">
                    <font-awesome-icon icon="fa fa-user" />
                </div>

                <div class="user-data-box">

                    <div class="user-data-row" v-if="!editUsernameVisible">
                        <h2 class="username user-data">{{ userDataRef.username }}</h2>
                        <button class="edit-btn" v-if="authenticatedUserUID === userID" @click="toggleEditUsername" ><font-awesome-icon icon="fa fa-pen" class="edit-icon" /></button>
                    </div>
                    
                    <div class="user-edit-row" v-if="editUsernameVisible">
                        <input type="text" v-model="username" class="edit-user-input">
                        <button class="confirm-btn edit-user-btn" @click="updateUsername"> <font-awesome-icon icon="fa-check" /></button>
                        <button class="discard-btn edit-user-btn" @click="toggleEditUsername"> <font-awesome-icon icon="fa-xmark" /></button>
                    </div>

                    <h4 class="user-data-username">Username</h4>

                </div>

                <div class="user-data-box">
                    <h2 class="member-since user-data">{{ userDataRef.memberSince }}</h2>
                    <h4 class="user-data-username">Joined</h4>
                </div>

                <div class="user-data-box last">

                    <div class="user-data-row" v-if="!editFullNameVisible">
                        <h2 class="full-name user-data">{{ userDataRef.fullName }}</h2>
                        <button class="edit-btn" v-if="authenticatedUserUID === userID" @click="toggleEditFullName" ><font-awesome-icon icon="fa fa-pen" class="edit-icon"/></button>
                    </div>

                    <div class="user-edit-row" v-if="editFullNameVisible">
                        <input type="text" v-model="fullname" class="edit-user-input">
                        <button class="confirm-btn edit-user-btn" @click="updateFullName"> <font-awesome-icon icon="fa-check" /></button>
                        <button class="discard-btn edit-user-btn" @click="toggleEditFullName"> <font-awesome-icon icon="fa-xmark" /></button>
                    </div>

                    <h4 class="user-data-username">Full Name</h4>
                </div>
                
            </div>

            <div class="user-activity">
                <div class="option-boxes">
                    <button class="option-box" @click="setVisibleDataset($event)" :class="{'chosen-option-box': visibleDataSet === 'Questions'}">Questions</button>
                    <button class="option-box" @click="setVisibleDataset($event)" :class="{'chosen-option-box': visibleDataSet === 'Answers'}">Answers</button>
                    <button class="option-box" @click="setVisibleDataset($event)" :class="{'chosen-option-box': visibleDataSet === 'Following'}">Following</button>
                    <button class="option-box" @click="setVisibleDataset($event)" :class="{'chosen-option-box': visibleDataSet === 'Followers'}">Followers</button>
                </div>
                <div class="user-questions" v-if="visibleDataSet === 'Questions'">
                    <QuestionItem v-for="question in userQuestions" :key="question.id" :questionData="question" :hideUsername="true"/>
                </div>
                <div class="user-answers" v-if="visibleDataSet === 'Answers'">
                    <AnswerItem v-for="answer in userAnswers" :key="answer.id" :answerData="answer" :showQuestion="true" />
                </div>
                <div class="user-following" v-if="visibleDataSet === 'Following'">
                    No Data
                </div>
                <div class="user-followers" v-if="visibleDataSet === 'Followers'">
                    No Data
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { db } from '@/firebase';
    import { doc, getDoc, updateDoc, collection, query, where, getDocs} from 'firebase/firestore';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import QuestionItem from '@/boxes/QuestionItem.vue';
    import AnswerItem from '@/boxes/AnswerItem.vue';

    // Authentication Check
    let auth = getAuth()
    let authenticatedUserUID = ref("");
    onAuthStateChanged(auth, (user) => {
        if(user){
            authenticatedUserUID.value = user.uid
        }
    })

    const route = useRoute()
    const userID = route.params.id

    // Get Data
    onMounted(() => {
        getUserData()
        getUserQuestions()
        getUserAnswers()
    })

    let userDataRef = ref({});
    let username = ref("");
    let fullname = ref("")

    const getUserData = async () => {

        const userRef = doc(db, "users", userID);
        const userData = await getDoc(userRef);

        if(userData.exists()){

            userDataRef.value = {
                fullName: userData.data().fullName,
                memberSince: userData.data().memberSince,
                username: userData.data().username,
                email: userData.data().email,
                userID: userData.data().uid
            }

            username.value = userDataRef.value.username
            fullname.value = userDataRef.value.fullName
        }
    }


    // Get questions associated with user
    let userQuestions = ref([])

    const getUserQuestions = async () =>  {

        const q = query(collection(db, "questions"), where("authorID", "==", userID ))
        const querySnapshot = await getDocs(q);

        let userQuestionsFirebase = []

        querySnapshot.forEach((doc) => {
            let questionFirebase = {... doc.data(), id: doc.id}
            userQuestionsFirebase.push(questionFirebase)
        })

        userQuestions.value = userQuestionsFirebase
    
    }


    // Get answers associated with user
    let userAnswers = ref([])

    const getUserAnswers = async () =>{
        
        const q = query(collection(db, "answers"), where("authorID", "==", userID ))
        const querySnapshot = await getDocs(q);

        let userAnswersFirebase = []

        querySnapshot.forEach((doc) => {
            let answerFirebase = {... doc.data(), id: doc.id}
            userAnswersFirebase.push(answerFirebase)
        })

        userAnswers.value = userAnswersFirebase
    
    }

    // Toggle betweeen questions, answers, followers and following
    let visibleDataSet = ref("Questions")
    const setVisibleDataset = (e) => {
        visibleDataSet.value = e.target.innerText
        console.log(visibleDataSet.value)
    }

    // Enable updating username 
    let editUsernameVisible = ref(false)
    const toggleEditUsername = () =>{
        username.value = userDataRef.value.username
        editUsernameVisible.value = !editUsernameVisible.value
    }

    // Update username
    const updateUsername = async () => {

        const usernameRef = doc(db, "users", userID)

        await updateDoc(usernameRef, {
            username: username.value
        })
        getUserData()

        userAnswers.value.forEach(async (answer) => {

            if(answer.author === userDataRef.value.username){

                const answerUpdateRef = doc(db, "answers", answer.id);
                await updateDoc(answerUpdateRef, {
                    author: username.value
                })

            }    

        })

        userQuestions.value.forEach(async(question) => {

            if(question.author === userDataRef.value.username){

                const questionUpdateRef = doc(db, "questions", question.id)
                await updateDoc(questionUpdateRef, {
                    author: username.value
                })
            }

        })

        toggleEditUsername();
    }

    // Enable updating full name
    let editFullNameVisible = ref(false)
    const toggleEditFullName = async () =>{
        fullname.value = userDataRef.value.fullName
        editFullNameVisible.value = !editFullNameVisible.value
    }

    // Update full name
    const updateFullName = async () =>{

        const fullNameRef = doc(db, "users", userID)

        await updateDoc(fullNameRef, {
            fullName: fullname.value
        })

        getUserData()
        toggleEditFullName()
    }

</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";

    .grid-view{
        display: grid;
        grid-template-columns: 20% 80%;
    }

    .user-data-container{
        @include flex-column();
        align-items: flex-start;
        text-align: left
    }
    .user-icon{
        @include flex-row();
        justify-content: center;
        align-items: center;
        background-color: $green;
        color: $darkgrey;
        height: 15rem;
        width: 15rem;
        font-size: 8rem;
        border-radius: 50%;  
        margin-bottom: 3rem;  
    }

    .user-data-box{
        margin: 1rem 0;
        font-weight: lighter;
    }
    .user-data-row{
        @include flex-row();
        align-items: center;
    }
    .edit-btn{
        background-color: transparent;
        margin-left: 1rem;
        font-size: 1.6rem;
        padding: 10px;
        border: none;
        outline: none;
        cursor: pointer;
        transition: all 0.4s;
        .edit-icon{
            color: $green;
        }
    }
    .edit-btn:hover{
        background-color: $grey;
        color: $purple;
    }

    .user-data{
        font-size: 2.5rem;
        color: $white;
        font-weight: lighter;
    }
    .user-data-username{
        color: $lightgrey;
        font-size: 1.5rem;
        font-weight: lighter;
    }
    .last{
        margin-bottom: 3rem;
    }

    .option-boxes{
        @include flex-row();
        justify-content: flex-start;
        margin-bottom: 4rem;

        .option-box{
            background-color: $purple;
            margin-right: 2rem;
            font-size: 2rem;
            padding: 0.8rem 1.6rem;
            cursor: pointer;
            outline: none;
            border: none;
            transition: all 0.2s;
        }
        .option-box:hover{
            background-color: $green;
        }
        .chosen-option-box{
            background-color: $green;
        }

    }


    /* Media Queries */

    @media(max-width: 1100px){
        .grid-view{
            grid-template-columns: 100%;
            align-content: start;
        }
        .user-data-container{
            @include flex-row();
            justify-content: flex-start;
            align-items: center;
            height: fit-content;
        }
        .user-data-box, .user-icon{
            margin: 0;
            margin-right: 4rem;
        }
        .option-boxes{
            @include flex-row();
            justify-content: flex-start;
            margin: 4rem 0;

           
        }
    }

    @media(max-width: 860px){
        .user-icon{
            font-size: 5vw;
            padding: 2rem;
        }
        .user-data{
            font-size: 4vw;
        }
        .user-data-username{
            font-size: 3vw;
        }
        .option-boxes{
            justify-content: space-between;

            .option-box{
                margin: 0;
                font-size: 3vw;
            }
        }
    }

    @media(max-width: 670px){
        .user-data-box, .user-icon{
            margin-right: 2rem;
        }
        .user-data{
            font-size: 3.6vw;
        }
        .user-data-username{
            font-size: 2.6vw;
        }
    }

</style>