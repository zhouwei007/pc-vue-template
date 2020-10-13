export default {
  base: '/role/',
  key: 'user',
  title: '用户角色管理',
  icon: 'hl-icon-361',
  routes: [{
    title: '角色管理',
    path: 'role',
    name: 'roleList',
    component: () => import('@/pages/role/role'),
    meta: {
      keepAlive: true // 是否需要被缓存
    },
    leftbar: true
  },{
    title: '用户管理',
    path: 'user',
    name: 'userList',
    component: () => import('@/pages/role/user'),
    meta: {
      keepAlive: false // 是否需要被缓存
    },
    key: 'userManage',
    leftbar: true
  }]
}
