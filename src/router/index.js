import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '总览', icon: 'dashboard', affix: true }
    }]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: '/#',
        meta: { title: '外部链接', icon: 'link' }
      }
    ]
  },
  {
    path: '/Article',
    component: Layout,
    redirect: '/Article/AllArticle',
    name: 'Article',
    meta: { title: '文章', icon: 'example' },
    children: [
      {
        path: 'AllArticle',
        name: 'AllArticle',
        component: () => import('@/views/article/allArticle'),
        meta: { title: '所有文章', icon: 'table' }
      },
      {
        path: 'EditArticle',
        name: 'EditArticle',
        component: () => import('@/views/article/editArticle'),
        meta: { title: '编辑文章', icon: 'tree' }
      },
      {
        path: 'Catalog',
        name: 'Catalog',
        component: () => import('@/views/article/Catalog'),
        meta: { title: '分类目录', icon: 'tree' }
      }
    ]
  },

  {
    path: '/Comment',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Comment',
        component: () => import('@/views/form/index'),
        meta: { title: '评论', icon: 'form' }
      }
    ]
  },

  {
    path: '/User',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/form/index'),
        meta: { title: '用户', icon: 'form' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/navigationMenu',
    name: 'Nested',
    meta: {
      title: '设置',
      icon: 'nested'
    },
    children: [
      {
        path: 'navigationMenu',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'navigationMenu',
        meta: { title: '导航菜单' }
      },
      {
        path: 'slideShow',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: '/slideShow',
        meta: { title: '导航菜单' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
