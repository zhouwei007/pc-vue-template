export default {
  base: '/systemMonitor/',
  key: 'systemMonitor',
  title: '监控',
  icon: 'hl-icon-361',
  routes: [{
    title: '工作流',
    path: 'workflowMonitor',
    name: 'workflowMonitor',
    component: () => import('@/pages/systemMonitor/workflow'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    key: 'workflowMonitor',
    leftbar: true
  },
    {
      title: '历史',
      path: 'workflowHistory',
      name: 'workflowHistory',
      component: () => import('@/pages/systemMonitor/history'),
      meta: {
        keepAlive: false // 是否需要被缓存
      },
      key: 'workflowHistory',
      leftbar: true
    }
  ]
}
