import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken, getEmail, removeEmail, setEmail } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  email: getEmail()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { email, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ email: email.trim(), password: password }).then(response => {
        const { data } = response
        if (data.token) {
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  setUserMessage({ commit }, userInfo) {
    console.log('UserInfo：', userInfo)
    const { nickname, avatar, email } = userInfo
    console.log('email：', email)
    commit('SET_NAME', nickname)
    commit('SET_AVATAR', avatar)
    commit('SET_EMAIL', email)
    setEmail(email)
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_EMAIL', '')
        removeToken()
        removeEmail()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

