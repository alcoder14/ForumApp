<template>
    <div class="users-container followers-container">
        <userItem v-for="follower in followers" :key="follower.userID" :username="follower.username" :userID="follower.userID" />
    </div>
</template>

<script setup>

    import { db } from '@/firebase'
    import { doc, query, where, getDocs, collection, getDoc} from 'firebase/firestore'
    import { defineProps, ref, onMounted} from 'vue'
    import userItem from "../../boxes/userItem.vue";
    import { emitter } from "@/emitter"

    const props = defineProps(['profileUserID'])
    const profileUserID = ref(props.profileUserID)

    onMounted(() => {
        getFollowers()
    })

    emitter.on("refreshFollowers", ()=>{
        console.log("hey there")
        getFollowers()
    })

    let followers = ref([])
    const getFollowers = async () => {
        followers.value = []

        const q = query(collection(db, "followers"), where("followedUserID", "==", profileUserID.value))

        const querySnapshot = await getDocs(q)

        querySnapshot.forEach( async (document)=>{
            const userRef = doc(db, "users", document.data().followerID)
            const userSnapshot = await getDoc(userRef)

            const userData = {
                username: userSnapshot.data().username,
                userID: userSnapshot.id
            }
            followers.value.push(userData)
        })
        console.log(followers.value)
    }

</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";
</style>