export default {
  base: '/welcome/',
  key: 'user',
  title: '欢迎',
  routes: [{
    title: '欢迎',
    path: 'index',
    name: 'welcome',
    component: () => import('@/pages/welcome/index'),
    meta: {
      keepAlive: false // 是否需要被缓存
    }
  }]
}
