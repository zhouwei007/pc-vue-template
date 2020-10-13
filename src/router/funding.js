export default {
  base: '/funding/',
  key: 'fundManage',
  title: '资金方管理',
  icon: 'hl-icon-361',
  routes: [{
    title: '资金方列表',
    path: 'list',
    name: 'fundingList',
    component: () => import('@/pages/funding/list'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    key: 'fundList',
    leftbar: true
  },{
    title: '产品列表',
    path: 'product',
    name: 'productList',
    component: () => import('@/pages/funding/product'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    key: 'fundProduct',
    leftbar: true
  },
  {
    title: '城市管理',
    path: 'city',
    name: 'city',
    component: () => import('@/pages/funding/city'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    key: 'fundCity',
    leftbar: true
  },{
    title: '资方渠道管理',
    path: 'channel',
    name: 'channel',
    component: () => import('@/pages/funding/channel'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    key: 'fundChannel',
    leftbar: true
  },{
    title: '产品管理',
    path: 'detail',
    name: 'fundDetail',
    component: () => import('@/pages/funding/detail/index'),
    meta: {
      keepAlive: false // 是否需要被缓存
    }
  }]
}
