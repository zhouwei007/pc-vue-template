import Vue from 'vue'
import Router from 'vue-router'
import HlLayout from '@/layout'
import demandsRouter from './demands'
import loginRouter from './login'
import centerRouter from './center'
import fundingRouter from './funding'
import platformRouter from './platform'
import monitorRouter from './monitor'
import systemMonitor from './systemMonitor'
import roleRouter from './role'
import welcomeRouter from './welcome'
import doneTaskRouter from './doneTask'

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/welcome/index'
  },
  ...[
    demandsRouter,
    fundingRouter,
    platformRouter,
    centerRouter,
    monitorRouter,
    roleRouter,
    welcomeRouter,
    systemMonitor,
    doneTaskRouter,
    welcomeRouter
  ].map(item => ({
    path: item.base,
    component: HlLayout,
    children: item.routes
  })),
  loginRouter
]
const router = new Router({
  routes: routes
})
router.beforeEach((to, from, next) => {
  document.title = "中后台管理"
  next()
})

export default router
