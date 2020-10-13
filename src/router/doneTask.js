export default {
  base: '/doneTask/',
  key: 'myPartake',
  title: '我的已办任务',
  icon: 'hl-icon-362',
  routes: [{
    title: '已办借款',
    path: 'borrow',
    name: 'borrowList',
    component: () => import('@/pages/doneTask/borrow'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    key: 'PartakeLoan',
    leftbar: true
  },{
    title: '已办借款详情',
    path: 'borrow/detail',
    name: 'borrowList',
    component: () => import('@/pages/doneTask/borrow/detail'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    leftbar: false
  }]
}
