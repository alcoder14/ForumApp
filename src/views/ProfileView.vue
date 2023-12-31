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
                        <button class="confirm-btn edit-user-btn" @click="updateUsername(username, userDataRef.username)"> <font-awesome-icon icon="fa-check" /></button>
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
                        <button class="confirm-btn edit-user-btn" @click="updateFullName(fullname)"> <font-awesome-icon icon="fa-check" /></button>
                        <button class="discard-btn edit-user-btn" @click="toggleEditFullName"> <font-awesome-icon icon="fa-xmark" /></button>
                    </div>

                    <h4 class="user-data-username">Full Name</h4>
                </div>

                <button class="follow-btn-desktop tool tool-green" @click="followUser" v-if="authenticatedUserUID !== userDataRef.userID && !isFollowed"><font-awesome-icon icon="fa fa-plus"/> Follow </button>
                
                <button class="unfollow-btn-desktop tool tool-green" v-if="isFollowed" @click="unfollowUser">Unfollow</button>
            </div>

            <div class="user-activity">

                <button class="follow-btn-mobile tool tool-green" @click="followUser" v-if="authenticatedUserUID !== userDataRef.userID && !isFollowed"><font-awesome-icon icon="fa fa-plus"/> Follow </button>
                
                <button class="unfollow-btn-mobile tool tool-green" v-if="isFollowed" @click="unfollowUser">Unfollow</button>

                <div class="option-boxes">
                    <button class="option-box" @click="setVisibleDataset($event)" :class="{'chosen-option-box': visibleDataSet === 'Questions'}">Questions</button>
                    <button class="option-box" @click="setVisibleDataset($event)" :class="{'chosen-option-box': visibleDataSet === 'Answers'}">Answers</button>
                    <button class="option-box" @click="setVisibleDataset($event)" :class="{'chosen-option-box': visibleDataSet === 'Following'}">Following</button>
                    <button class="option-box" @click="setVisibleDataset($event)" :class="{'chosen-option-box': visibleDataSet === 'Followers'}">Followers</button>
                </div>
                <div class="user-questions" v-if="visibleDataSet === 'Questions'">
                    <QuestionItem v-for="question in userQuestions" :key="question.id" :questionData="question" :hideUsername="true" :shownOnProfilePage="true" @hideQuestion="hideQuestion" />
                </div>
                <div class="user-answers" v-if="visibleDataSet === 'Answers'">
                    <AnswerItem v-for="answer in userAnswers" :key="answer.id" :answerData="answer" :showQuestion="true" />
                </div>
                <FollowingContainer v-if="visibleDataSet === 'Following'" :profileUserID="userID" />
                <FollowersContainer v-if="visibleDataSet === 'Followers'" :profileUserID="userID"/>
            </div>

            <!-- Modals with fixed position -->

            <button class="mobile-settings-btn" @click="toggleMobileSettings">
                <font-awesome-icon icon="fa fa-pen" />
            </button>
            
            <MobileSettingsModal :username="userDataRef.username" :fullname="userDataRef.fullName" v-if="mobileSettingsVisible && authenticatedUserUID === userID" @closeModal="toggleMobileSettings" @updateUserData="receiveUpdateFromMobile" />

            <div class="warning-container" v-if="warningVisible">
                <p>Question was deleted</p>
                <button @click="cancelDeletion" class="undo-btn" >Undo</button>
            </div>
            
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref} from 'vue';
    import { useRoute } from 'vue-router';
    import { db } from '@/firebase';
    import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc, addDoc} from 'firebase/firestore';
    import { getAuth, onAuthStateChanged} from 'firebase/auth';
    import QuestionItem from '@/boxes/QuestionItem.vue';
    import AnswerItem from '@/boxes/AnswerItem.vue';
    import MobileSettingsModal from '@/modals/MobileSettingsModal.vue';
    import FollowersContainer from '@/components/ProfilePage/FollowersContainer.vue';
    import FollowingContainer from '@/components/ProfilePage/FollowingContainer.vue';
    import { emitter } from "@/emitter"

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

    const checkScreenWidth = () => {
        if(window.innerWidth > 1100){
            mobileSettingsVisible.value = false
        }
    }

    onMounted( async () => {
        getUserQuestions()
        getUserAnswers()
        checkScreenWidth()
        await getUserData()
        checkFollowing()

    })

    window.addEventListener("resize", checkScreenWidth)

    let userDataRef = ref({});
    let username = ref("");
    let fullname = ref("")

    // Get User Data/statistics
    const getUserData = async () => {

        const userRef = doc(db, "users", userID);
        const userData = await getDoc(userRef);

        if(userData.exists()){

            userDataRef.value = {
                fullName: userData.data().fullName,
                memberSince: userData.data().memberSince,
                username: userData.data().username,
                email: userData.data().email,
                userID: userData.id
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

    // Hide Question - requested from QuestionItem.vue

    let warningVisible = ref(false)
    let deletionTimeout = null;
    const hideQuestion = (id) => {
        warningVisible.value = true
        userQuestions.value = userQuestions.value.filter(question => question.id !== id)

        // Wait for three seconds before deleting question
        deletionTimeout = setTimeout(() => {
            warningVisible.value = false
            deleteQuestion(id)
        }, 3000)
    }

    // Delete question and associated answers 

    const deleteQuestion = async (id) =>{

        await deleteDoc(doc(db, "questions", id))
        userAnswers.value.forEach( async (answer) => {

            if(answer.questionID === id){   
                await deleteDoc(doc(db, "answers", answer.id))
            }

        })
    }

    // Cancel Deletion

    const cancelDeletion = () =>{
        clearInterval(deletionTimeout)
        getUserQuestions()
        warningVisible.value = false
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
    }

    // Enable updating username 
    let editUsernameVisible = ref(false)
    const toggleEditUsername = () =>{
        username.value = userDataRef.value.username
        editUsernameVisible.value = !editUsernameVisible.value
    }

    // Update username
    const updateUsername = async (newUsername, existingUsername) => {

        // Update username in users
        const usernameRef = doc(db, "users", userID)
        await updateDoc(usernameRef, {
            username: newUsername
        })
        getUserData()

        // Update author of answers
        userAnswers.value.forEach(async (answer) => {

            if(answer.author === existingUsername){

                const answerUpdateRef = doc(db, "answers", answer.id);
                await updateDoc(answerUpdateRef, {
                    author: newUsername
                })

            }    

        })

        // Update author of questions
        userQuestions.value.forEach(async(question) => {

            if(question.author === existingUsername){

                const questionUpdateRef = doc(db, "questions", question.id)
                await updateDoc(questionUpdateRef, {
                    author: newUsername
                })
            }

        })

        editUsernameVisible.value = false
    }

    // Enable updating full name
    let editFullNameVisible = ref(false)
    const toggleEditFullName = async () =>{
        fullname.value = userDataRef.value.fullName
        editFullNameVisible.value = !editFullNameVisible.value
    }

    // Update full name
    const updateFullName = async (newFullName) =>{

        const fullNameRef = doc(db, "users", userID)

        await updateDoc(fullNameRef, {
            fullName: newFullName
        })

        getUserData()
        editFullNameVisible.value = false
    }


    // Toggle mobile settings modal
    let mobileSettingsVisible = ref(false)
    const toggleMobileSettings = () =>{
        mobileSettingsVisible.value = !mobileSettingsVisible.value
    }

    // Receive Update From Mobile form

    const receiveUpdateFromMobile = (newUsername, newFullName) => {

        if(newUsername !== userDataRef.value.username){
            updateUsername(newUsername, userDataRef.value.username)
        }

        if(newFullName !== userDataRef.value.fullName){
            updateFullName(newFullName, userDataRef.value.newFullName)
        }

        toggleMobileSettings()
    }

    // Followers/Following Functionality

    const followUser = async () => {
        console.log("followUser")

        await addDoc(collection(db, "followers"), {
            followerID: authenticatedUserUID.value,
            followedUserID: userID 
        })
        emitter.emit("refreshFollowers")
        checkFollowing()

    }

    // Check if authenticated user is already following the profile

    let isFollowed = ref(false)
    let recordID = null 

    const checkFollowing = async () => {

        const q = query(collection(db, "followers"), where("followerID", "==", authenticatedUserUID.value), where("followedUserID", "==", userID))

        const querySnapshot = await getDocs(q)

        if(querySnapshot.empty){
            isFollowed.value = false
        } else {
            isFollowed.value = true
            // note: querySnapshot always contains only 1 record
            querySnapshot.forEach((doc) => {
                if(doc.id !== undefined){
                    recordID = doc.id
                } else {
                    recordID = null
                }
            })
        }
        
    }

    const unfollowUser = async () => {
        await deleteDoc(doc(db, "followers", recordID))

        emitter.emit("refreshFollowers")
        checkFollowing();
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
        background-color: $darkpurple;
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
            color: $darkpurple;
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
            background-color: $darkpurple;
        }
        .chosen-option-box{
            background-color: $darkpurple;
        }

    }

    // Modals with fixed position

    .mobile-settings-btn{
        display: none;
        z-index: 50;
        position: fixed;
        bottom: calc(10vh + 5rem);
        right: 5rem;
        height: 5rem;
        width: 5rem;
        font-size: 2.5rem;
        background-color: $purple;
        color: $darkgrey;
        outline: none;
        border: none;
        cursor: pointer;
    }

    $warningWidth: 400px;
    .warning-container{
        width: $warningWidth;
        margin-left: auto;
        margin-right: auto;
        position: fixed;
        bottom: 2rem;
        left: calc(50% - ($warningWidth / 2));
        @include flex-row();
        justify-content: space-between;
        align-items: center;
        background-color: $purple;
        z-index: 20;
        padding: 1rem;
        p, button{
            font-size: 2rem;
        }
        button{
            background-color: $grey;
            padding: 0.5rem;
            color: $white;
            outline: 0;
            cursor: pointer;
        }
    }

    .follow-btn-desktop, .unfollow-btn-desktop{
        margin-top: 1rem;
    }
    .follow-btn-mobile, .unfollow-btn-mobile{
        display: none;
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
        .user-icon{
            height: 10rem;
            width: 10rem;
            font-size: 5rem;
        }
        
        .option-boxes{
            @include flex-row();
            justify-content: flex-start;
            margin: 4rem 0;  
        }
    }

    @media(max-width: 860px){
        .follow-btn-desktop, .unfollow-btn-desktop{
            display: none;
        }
        .follow-btn-mobile, .unfollow-btn-mobile{
            display: block;
            width: 100%;
            margin-top: 2rem
        }

        .user-icon{
            font-size: 5vw;
            padding: 2rem;
            height: 10vw;
            width: 10vw;
        }
        .edit-btn{
            display: none;
        }
        .user-data{
            font-size: 3.2vw;
        }
        .user-data-username{
            font-size: 2.4vw;
        }
        .option-boxes{
            justify-content: space-between;

            .option-box{
                margin: 0;
                font-size: 3vw;
                width: 25%;
            }
        }

        .mobile-settings-btn{
            display: block;
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
        .option-boxes{
            margin-bottom: 2rem;
        }
        .mobile-settings-btn{
            bottom: calc(10vh + 3rem);
            right: 3rem;
            height: 7vw;
            width: 7vw;
            font-size: 4vw;
        }
    }
</style>