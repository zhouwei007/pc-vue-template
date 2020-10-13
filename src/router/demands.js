export default {
  base: '/demands/',
  key: 'myTask',
  title: '我的待办任务',
  icon: 'hl-icon-362',
  routes: [
    {
      title: '待办助贷资金需求',
      path: 'list',
      name: 'demands',
      component: () => import('@/pages/demands/list'),
      meta: {
        keepAlive: false // 是否需要被缓存
      },
      key: 'assistLoan',
      leftbar: true
    },
    {
      title: '待办助贷借款',
      path: 'borrow/list',
      name: 'borrowList',
      component: () => import('@/pages/borrow/list'),
      meta: {
        keepAlive: false // 是否需要被缓存
      },
      key: 'loanTaskAL',
      leftbar: true
    },
    {
      title: '待办助贷（D）资金需求',
      path: 'listD',
      name: 'demandsD',
      component: () => import('@/pages/demands/listD'),
      meta: {
        keepAlive: false // 是否需要被缓存
      },
      key: 'assistLoanD',
      leftbar: true
    },
    {
      title: '待办助贷（D）借款',
      path: 'borrow/listD',
      name: 'borrowListD',
      component: () => import('@/pages/borrow/listD'),
      meta: {
        keepAlive: false // 是否需要被缓存
      },
      key: 'loanTaskALD',
      leftbar: true
    },
    {
      title: '待办机构资金需求',
      path: 'organization/list',
      name: 'organization',
      component: () => import('@/pages/demands/organization'),
      meta: {
        keepAlive: false // 是否需要被缓存
      },
      key: 'organization',
      leftbar: true
    },
    {
      title: '待办机构借款',
      path: 'borrow/OrgList',
      name: 'loanTaskOrg',
      component: () => import('@/pages/borrow/OrgList'),
      meta: {
        keepAlive: false // 是否需要被缓存
      },
      key: 'loanTaskOrg',
      leftbar: true
    },
    {
      title: '待办垫资需求',
      path: 'advanceMoney/list',
      name: 'advanceMoney',
      component: () => import('@/pages/demands/advanceMoney'),
      meta: {
        keepAlive: false // 是否需要被缓存
      },
      key: 'advanceMoney',
      leftbar: true
    },
    {
      title: '待办垫资借款',
      path: 'borrow/advanceList',
      name: 'loanTaskAM',
      component: () => import('@/pages/borrow/advanceList'),
      meta: {
        keepAlive: false // 是否需要被缓存
      },
      key: 'loanTaskAM',
      leftbar: true
    },{
    title: '待审资金需求',
    path: 'pendding/list',
    name: 'penddingList',
    component: () => import('@/pages/pendding/list'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    key: 'applyTask',
    leftbar: true
  },{
    title: '待审资金需求详情',
    path: 'pendding/detail',
    name: 'penddingDetail',
    component: () => import('@/pages/pendding/detail'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    leftbar: false
  },{
    title: '需求详情',
    path: 'detailOrEdit',
    name: 'detailOrEdit',
    component: () => import('@/pages/demands/detailOrEdit'),
    meta: {
      keepAlive: false // 是否需要被缓存
    }
  },
   {
    title: '借款详情',
    path: 'borrow/detail',
    name: 'borrowDetail',
    component: () => import('@/pages/borrow/detail'),
    meta: {
      keepAlive: false // 是否需要被缓存
    }
  },{
    title: '资金方进件详情',
    path: 'funding/detailOrEdit',
    name: 'fundingDetail',
    component: () => import('@/pages/demands/funding/detailOrEdit'),
    meta: {
      keepAlive: false // 是否需要被缓存
    }
  }]
}
