import BaseRequest from '@/common/request'

class SystemMonitor extends BaseRequest {
  constructor () {
    super()
    this.url = '/gateway/saas-harbour'
  }

  // 获取工作流列表
  listMonitorPage (obj = {}) {
    return super.get(`${this.url}/monitor/listMonitorPage`, obj, {
      loading: false
    })
  }
  // 获取历史列表
  instanceHistory (obj = {}) {
    return super.get(`${this.url}/monitor/instanceHistory`, obj, {
      loading: false
    })
  }
  // 重试
  retryProcess (obj = {}) {
    return super.get(`${this.url}/monitor/retryProcess`, obj, {
      loading: false
    })
  }
  // 产品名称
  findBizCodeDictPerm (obj = {}) {
    return super.get(`${this.url}/monitor/listFundType`, obj, {
      loading: false
    })
  }
  // 工作流名称
  listProcess (obj = {}) {
    return super.get(`${this.url}/monitor/listProcess`, obj, {
      loading: false
    })
  }
  // 办理决策
  loadCodeItems (obj = {}) {
    return super.get(`${this.url}/monitor/listDecision`, obj, {
      loading: false
    })
  }

}

export default new SystemMonitor()
