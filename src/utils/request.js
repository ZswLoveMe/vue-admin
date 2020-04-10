import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: 'zsw', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

service.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

service.interceptors.request.use(config => {
  console.log('getToken：', getToken())
  if (getToken()) {
    config.headers['token'] = getToken()
  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    const res = response.data
    console.log('res：', res)
    if (res.error !== 0 && res.error !== -1) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.error === 50008 || res.error === 50012 || res.error === 50014) {
        MessageBox.confirm('您已经登出，您可以取消以停留在此页面，或再次登录', '确认注销', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
