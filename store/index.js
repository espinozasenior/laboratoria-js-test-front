import axios from 'axios'
import api, { logout, createPost, fetchFeed, savePost, deletePost } from '@/services/api'
const baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:4000/v1' : 'https://laboratoria-back.herokuapp.com/v1'

export const state = () => ({
  authUser: null,
  feed: []
})

export const mutations = {
  SET_USER: function (state, user) {
    state.authUser = user
  },
  GET_USER: function (state, user) {
    return state.authUser
  },
  SET_FEED: function (state, feed) {
    state.feed = feed
  },
  GET_FEED: function (state) {
    return state.feed
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  async nuxtServerInit ({ commit }, { req }) {
  },
  async login ({ commit }, user) {
    try {
      const { data } = await axios.post(baseURL + '/customers/login?include=user', user)
      commit('SET_USER', data)
      Object.assign(api.defaults, { headers: { Authorization: data.id } })
      localStorage.setItem('Auth', data.id)
      this.$router.replace({ path: '/' })
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  async logout ({ commit }) {
    await logout()
    commit('SET_USER', null)
    localStorage.removeItem('Auth')
    this.$router.replace({ path: '/login' })
  },
  async createPost ({ commit }, post) {
    try {
      const { data } = await createPost(post)
      return data
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  async fetchFeed ({ commit }) {
    try {
      const { data } = await fetchFeed()
      commit('SET_FEED', data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  async savePost ({ commit }, post) {
    try {
      const { data } = await savePost(post)
      return data
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  async deletePost ({ commit }, id) {
    try {
      return await deletePost(id)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  }
}
