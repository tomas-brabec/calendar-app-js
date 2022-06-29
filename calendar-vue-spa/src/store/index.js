import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // JWT token/jmeno zkusime pri spusteni aplikace najit v localstorage prohlizece
    token: localStorage.getItem('access_token') || null,
    username: localStorage.getItem('username') || null
  },
  getters: {
    loggedIn (state) {
      return state.token !== null
    }
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    setUsername (state, username) {
      state.username = username
    }
  },
  actions: {
    async login (context, credentials) {
      try {
        const res = await axios.post('http://localhost:3000/api/user/login', { email: credentials.email, password: credentials.password })
        localStorage.setItem('access_token', res.data.token)
        localStorage.setItem('username', res.data.user.name)
        context.commit('setToken', res.data.token)
        context.commit('setUsername', res.data.user.name)
      } catch (e) {
        throw new Error(e)
      }
    },
    async logout (context) {
      try {
        if (context.getters.loggedIn) {
          const token = context.state.token
          localStorage.removeItem('access_token')
          localStorage.removeItem('username')
          context.commit('setToken', null)
          context.commit('setUsername', null)
          await axios.post('http://localhost:3000/api/user/logout', {}, { headers: { Authorization: `Bearer ${token}` } })
        }
      } catch (e) {
        console.error(e)
      }
    },
    async register (context, credentials) {
      try {
        const res = await axios.post('http://localhost:3000/api/user', { name: credentials.name, email: credentials.email, password: credentials.password })
        localStorage.setItem('access_token', res.data.token)
        localStorage.setItem('username', res.data.user.name)
        context.commit('setToken', res.data.token)
        context.commit('setUsername', res.data.user.name)
      } catch (e) {
        throw new Error(e)
      }
    }
  },
  modules: {
  }
})
