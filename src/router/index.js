import Vue from 'vue'
import Router from 'vue-router'
// import store from '@/store'

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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
    path: '/',
    redirect: '/login'
  },
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
    path: '/dashboard',
    component: Layout,
    children: [{
      path: '',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'chart' }
    }]
  },

  {
    path: '/book',
    component: Layout,
    children: [
      {
        path: '',
        name: '书库',
        component: () => import('@/views/table/book-table'),
        meta: { title: '书库', icon: 'education' }
      }
    ]
  },

  {
    path: '/cart',
    component: Layout,
    children: [
      {
        path: '',
        name: '选购车',
        component: () => import('@/views/table/cart-table'),
        meta: { title: '选购车', icon: 'el-icon-shopping-cart-2' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: '',
        name: '订单',
        component: () => import('@/views/table/order-table'),
        meta: { title: '订单', icon: 'skill' }
      }
    ]
  },

  {
    path: '/pay',
    component: Layout,
    children: [
      {
        path: '',
        name: '支付',
        component: () => import('@/views/pay'),
        meta: { title: '支付', icon: 'el-icon-wallet' }
      }
    ],
    hidden: true
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/Leonhard-Euler-ai',
        meta: { title: '外链', icon: 'link' }
      }
    ],
    hidden: false
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/login') {
    return next()
  }

  // if (store.state.user.token === null) {
  //   return next('/login')
  // }
  next()
})

export default router
