<template>
    <div class="outer-container">
        <div class="inner-container">
            <div class="tools-single-container">

                <div class="results">
                    <h1 class="title">Results for "{{ searchQuery }}"</h1>
                    <div class="switch-buttons">
                        <button class="switch-btn questions-btn" @click="toggleVisibleResultSet('questions')" :class="{'chosen-btn': visibleResultSet == 'questions'}" >Questions <span class="number">{{ questions.length }}</span></button>

                        <button class="switch-btn users-btn" @click="toggleVisibleResultSet('users')" :class="{'chosen-btn': visibleResultSet == 'users'}">Users <span class="number">{{ users.length }}</span></button>
                    </div>
                </div>

            </div>

            <div class="questions-container" v-if="visibleResultSet === 'questions' && questions.length > 0">
                <QuestionItem v-for="question in questions" :key="question.id" :questionData="question" />
            </div>
            <div class="no-results" v-if="visibleResultSet == 'questions' && questions.length === 0">
                <font-awesome-icon icon="fa fa-face-frown" class="sad-face-icon" />
                <p class="no-results-text">No Results</p>
                <router-link to="/ask" >
                    <button class="tool tool-green ask-btn"> Ask Question <font-awesome-icon icon="fa fa-arrow-right" class="arrow-icon" /></button>
                </router-link>
            </div>

            <div class="users-container" v-if="visibleResultSet === 'users' && users.length > 0">
                <userItem v-for="user in users" :key="user.id" :username="user.username" :userID="user.id" />
            </div>
            <div class="no-results" v-if="visibleResultSet === 'users' && users.length === 0">
                <font-awesome-icon icon="fa fa-face-frown" class="sad-face-icon" />
                <p class="no-results-text">No Results</p>
            </div>

        </div>
    </div>
</template>

<script setup>

    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { db } from '@/firebase';
    import { collection, query, getDocs } from 'firebase/firestore';
    import QuestionItem from '@/boxes/QuestionItem.vue';
    import userItem from '@/boxes/userItem.vue';

    const route = useRoute();
    const searchQuery = ref(route.params.query)
    let lowercaseQuery = searchQuery.value.toLowerCase()


    onMounted(() => {
        filterQuestions()
        filterUsers()
    })

    let questions = ref("")
    const filterQuestions = async () =>  {
        const q = query(collection(db, "questions"))
        const querySnapshot = await getDocs(q);

        let questionsFirebase = []

        querySnapshot.forEach((doc) => {
            let questionFirebase = {... doc.data(), id: doc.id}

            // Accept only questions that include the search query
            if(questionFirebase.question.toLowerCase().includes(lowercaseQuery)){
                questionsFirebase.push(questionFirebase)
            }

        })

        questions.value = questionsFirebase
        
    }

    let users = ref("")
    const filterUsers = async () => {
        const q = query(collection(db, "users"))
        const querySnapshot = await getDocs(q);

        let usersFirebase = []

        querySnapshot.forEach((doc) => {
            let userFirebase = {... doc.data(), id: doc.id}

            // Accept only users whose username includes the search query
            if(userFirebase.username.toLowerCase().includes(lowercaseQuery)){
                usersFirebase.push(userFirebase)
            }

        })

        users.value = usersFirebase
        
    }

    let visibleResultSet = ref("questions")
    const toggleVisibleResultSet = (resultSet) => {
        visibleResultSet.value = resultSet
    }


</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";

    .results{
        width: 100%;
        @include flex-column();
        align-items: flex-start;
    }
    .title{
        margin-bottom: 2rem;
    }
    .switch-buttons{
        @include flex-row();
    }
    .number{
        margin-left: 1rem;
    }
    .switch-btn{
        padding: 1rem 4rem 1rem 0;
        font-size: 2rem;
        background-color: transparent;
        border: none;
        border-bottom: 2px solid $purple;
        color: $purple;
        outline: none;
        cursor: pointer;
    }
    .chosen-btn{
        color: $green;
        border-bottom: solid 2px $green;
    }
    .users-btn{
        margin-left: 1rem;
    }
    .no-results{
        background-color: $grey;
        height: 50vh;
        @include flex-column();
        justify-content: center;
        align-items: center;
        color: $purple;
        border: solid 2px $purple;
        .no-results-text{
            font-size: 2rem;
            margin: 2rem;
        }
        .sad-face-icon{
            font-size: 8rem;
            color: $darkgrey;
        }

    }

    @media(max-width: 700px){
        .switch-buttons{
            width: 100%;
        }
        .switch-btn{
            width: 50%;
            text-align: center;
            padding: 1rem;
            border: none;
            background-color: $purple;
            color: $grey;
        }
        .chosen-btn{
            background-color: $green;
        }
        .users-btn{
            margin-left: 0.5rem;
        }
        .questions-btn{
            margin-right: 0.5rem;
        }

    }
</style>