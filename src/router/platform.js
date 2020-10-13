export default {
  base: '/platform/',
  key: 'platform',
  title: '平台费用管理',
  icon: 'hl-icon-360',
  routes: [{
    title: '平台费用列表',
    path: 'list',
    name: 'platformList',
    component: () => import('@/pages/platform'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    key: 'platformList',
    leftbar: true
  }]
}
