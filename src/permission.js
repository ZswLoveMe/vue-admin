import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { loaderAvatar } from '@/api/user'
import { DeepCopy } from '@/utils/tool'

NProgress.configure({ showSpinner: false })

router.beforeEach(async(to, from, next) => {
  // 确定用户是否已登录
  NProgress.start()
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      const email = store.getters.email
      const avatar = store.getters.avatar
      if (email && !avatar) {
        const params = { email }
        loaderAvatar(params).then(async res => {
          if (res.error === 0) {
            const userMessage = DeepCopy(res.data[0])
            console.log('userMessage：', userMessage)
            userMessage.avatar = '/zsw' + userMessage.avatar
            await store.dispatch('user/setUserMessage', userMessage)
            next({ ...to, replace: true })
            NProgress.done()
          } else {
            await store.dispatch('user/resetToken')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        })
      } else {
        next()
        NProgress.done()
      }
    }
  } else {
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

