import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faPlus, faHouse, faUser, faRightFromBracket, faMagnifyingGlass, faPen, faChevronDown, faAnglesUp, faRightToBracket, faPenToSquare, faXmark, faArrowRight, faFaceFrown, faCheck } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faHouse, faUser, faRightFromBracket, faMagnifyingGlass, faPen, faChevronDown, faAnglesUp, faRightToBracket, faPenToSquare, faXmark, faArrowRight, faFaceFrown, faCheck)

import mitt from 'mitt'
const emitter = mitt()

const app = createApp(App)

app.use(router)
app.component("font-awesome-icon", FontAwesomeIcon)

app.config.globalProperties.emitter = emitter
app.mount("#app")
