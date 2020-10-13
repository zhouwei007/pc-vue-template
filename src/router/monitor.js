export default {
  base: '/monitor/',
  key: 'monitor',
  title: '业务监控',
  icon: 'hl-icon-361',
  routes: [{
    title: '资金需求列表',
    path: 'apply',
    name: 'applyList',
    component: () => import('@/pages/monitor/apply'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    key: 'applyList',
    leftbar: true
  },{
    title: '资金需求详情',
    path: 'apply/detail',
    name: 'applyDetail',
    component: () => import('@/pages/monitor/apply/detail'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    leftbar: false
  }, {
    title: '借款列表',
    path: 'loan',
    name: 'loanList',
    component: () => import('@/pages/monitor/loan'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    key: 'loanList',
    leftbar: true
  },{
    title: '借款详情',
    path: 'loan/detail',
    name: 'loanDetail',
    component: () => import('@/pages/monitor/loan/detail'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    leftbar: false
  }, {
    title: '资金需求任务列表',
    path: 'apply/task',
    name: 'applyTaskList',
    component: () => import('@/pages/monitor/apply/task'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    key: 'applyTaskMoniter',
    leftbar: true
  }, {
    title: '借款任务列表',
    path: 'loan/task',
    name: 'loanTaskList',
    component: () => import('@/pages/monitor/loan/task'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    key: 'loanTaskMoniter',
    leftbar: true
  },{
    title: '线索列表',
    path: 'clues',
    name: 'clues',
    key: 'demandList',
    leftbar: true,
    component: () => import('@/pages/monitor/clues'),
    meta: {
      keepAlive: false // 是否需要被缓存
    }
  },{
    title: '线索详情',
    path: 'clues/detail',
    name: 'cluesDetail',
    component: () => import('@/pages/monitor/clues/detail'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    leftbar: false
  }]
}
