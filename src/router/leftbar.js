import demandsRouter from './demands'
import fundingRouter from './funding'
import platformRouter from './platform'
import monitorRouter from './monitor'
import roleRouter from './role'
import systemMonitor from './systemMonitor'
import doneTaskRouter from './doneTask'
const routeData = [
  ...[
    demandsRouter,
    doneTaskRouter,
    fundingRouter,
    platformRouter,
    monitorRouter,
    roleRouter,
    systemMonitor
  ].map(item => ({
    key: item.key,
    title: item.title,
    icon:  item.icon,
    path: item.base,
    children: item.routes.filter((route) => {
      return route.leftbar
    })
  }))
]

export default routeData
