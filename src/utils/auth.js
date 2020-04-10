import Cookies from 'js-cookie'

const TokenKey = 'token'
const email = 'email'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getEmail() {
  return Cookies.get(email)
}

export function setEmail(em) {
  return Cookies.set(email, em)
}

export function removeEmail() {
  return Cookies.remove(email)
}
