import api from '../../helpers/api'
import Vue from 'vue'

const state = {
  questions: [],
  fetched: false
}

const getters = {
  questions: (state) => {
    return state.questions
  }
}

const actions = {
  fetchQuestions ({commit, state}) {
    if (!state.fetched) {
      return new Promise((resolve, reject) => {
        api.get('questions').then(response => {
          commit('receive_questions', response.data)
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    }
  },
  createQuestion ({commit}, question) {
    return new Promise((resolve, reject) => {
      api.post(`questions`, question).then(response => {
        commit('create_question', response.data)
        resolve(response)
      }, error => {
        reject(error)
      })
    })
  },
  updateQuestion ({commit}, question) {
    return new Promise((resolve, reject) => {
      api.put(`questions/${question.id}/`, question).then(response => {
        commit('update_question', response.data)
        resolve(response)
      }, error => {
        reject(error)
      })
    })
  },
  deleteQuestion ({commit}, pk) {
    return new Promise((resolve, reject) => {
      api.delete(`questions/${pk}/`).then(response => {
        commit('delete_question', pk)
        resolve(response)
      }, error => {
        reject(error)
      })
    })
  }
}

const mutations = {
  receive_questions (state, questions) {
    state.questions = questions
    state.fetched = true
  },
  create_question (state, question) {
    state.questions.push(question)
  },
  update_question (state, question) {
    let index = state.questions.findIndex(x => x.id === question.id)
    Vue.set(state.questions, index, question)
  },
  delete_question (state, id) {
    let index = state.questions.findIndex(x => x.id === id)
    state.questions.splice(index, 1)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
