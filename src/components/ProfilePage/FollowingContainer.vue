<template>
    <div class="users-container following-container">
        <userItem v-for="user in following" :key="user.userID" :username="user.username" :userID="user.userID" />
    </div>
</template>

<script setup>

    import { db } from '@/firebase'
    import { doc, query, where, getDocs, collection, getDoc} from 'firebase/firestore'
    import { defineProps, ref, onMounted} from 'vue'
    import userItem from "../../boxes/userItem.vue";

    const props = defineProps(['profileUserID'])
    const profileUserID = ref(props.profileUserID)

    onMounted(() => {
        getFollowing()
    })

    let following = ref([])
    const getFollowing = async () => {
        following.value = []

        const q = query(collection(db, "followers"), where("followerID", "==", profileUserID.value))

        const querySnapshot = await getDocs(q)

        querySnapshot.forEach( async (document)=>{
            const userRef = doc(db, "users", document.data().followerID)
            const userSnapshot = await getDoc(userRef)

            const userData = {
                username: userSnapshot.data().username,
                userID: userSnapshot.id
            }
            following.value.push(userData)
        })
        console.log(following.value)
    }

</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";
</style>