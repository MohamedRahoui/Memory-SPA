import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import questions from './modules/questions'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    questions
  }
})
export default store
