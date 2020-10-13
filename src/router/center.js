export default {
  base: '/center/',
  key: 'center',
  title: '账号信息',
  routes: [{
    title: '账号信息',
    path: 'index',
    name: 'center',
    component: () => import('@/pages/center'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    leftbar: false
  }]
}
