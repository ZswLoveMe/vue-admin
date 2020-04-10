import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/do-login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/do-logout',
    method: 'post'
  })
}

export function loaderAvatar(params) {
  console.log('params：', params)
  return request({
    url: '/user/get-portrait',
    method: 'get',
    params
  })
}
