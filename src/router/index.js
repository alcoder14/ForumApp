import { createRouter, createWebHashHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import HomeView from '../views/HomeView.vue'
import LoginView  from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AskView from '../views/AskView.vue'
import TopicView from '../views/TopicView.vue'
import ProfileView from '../views/ProfileView.vue'
import SearchView from '../views/SearchView.vue'
import QuestionView from '../views/QuestionView.vue'
import ResetPasswordView from "../views/ResetPasswordView.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/ask',
    name: 'ask',
    component: AskView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/topic/:topic',
    name: 'topic',
    component: TopicView
  },
  {
    path: '/user/:id',
    name: 'user',
    component: ProfileView,
  },
  {
    path: '/search/:query',
    name: 'search',
    component: SearchView
  },
  {
    path: '/question/:id',
    name: 'question',
    component: QuestionView
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user)=> { 
        removeListener(); 
        resolve(user)
      }, 
      reject) 
  })
}

router.beforeEach( async (to, from, next) => {
  if(to.matched.some((record) => record.meta.requiresAuth)){
    if(await getCurrentUser()){
      next()
    } else {
      next("/")
    }
  } else {
    next()
  }
})

export default router
