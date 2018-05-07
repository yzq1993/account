import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: resolve => require(['@/page/index'], resolve)
    },
    {
      path: '/count',
      component: resolve => require(['@/page/count'], resolve)
    },
    {
      path: '/add',
      component: resolve => require(['@/page/add'], resolve)
    }
  ]
})
