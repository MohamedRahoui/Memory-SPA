import api from '../../helpers/api'

const state = {
  me: {},
  token: localStorage.getItem('token') || 'NONE'
}

const getters = {
  getMe: (state) => {
    return state.me
  },
  getToken: (state) => {
    return state.token
  }
}

const actions = {
  setMe ({commit}, me) {
    commit('receive_me', me)
  },
  login ({commit}, token) {
    commit('set_token', token)
  },
  logout ({commit}) {
    commit('dump_token')
  }
}

const mutations = {
  receive_me (state, me) {
    state.me = me
  },
  set_token (state, token) {
    localStorage.setItem('token', token)
    state.token = token
  },
  dump_token (state) {
    api.post('logout')
    state.me = {}
    state.token = 'NONE'
    localStorage.removeItem('token')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
