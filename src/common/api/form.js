import BaseRequest from '@/common/request'

class FormApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/gateway/saas-harbour'
  }
  // 获取进件表单
  getLoanData ({fundType, loanId, proKey = 'loan'}) {
    return super.post(`${this.url}/fund/form/viewForm4dist`, {
      fundType,
      taskId: loanId,
      proKey
    }, {
      loading: false
    })
  }
  // 获取需求表单
  getDemandsData ({loanId, taskId, proKey, nodeType, requireCode}) {
    // const url = 'http://localhost:8080/test.json'
    return super.post(`${this.url}/fund/form/viewTaskForm`, {
      // return super.get(url, {
      loanId,
      taskId,
      proKey,
      nodeType,
      requireCode
    }, {
      loading: false
    })
  }
  // 查看需求详情
  getDemandsDetail ({fundType, applyId=''}) {
    // const url = 'http://localhost:8080/test.json'
    return super.post(`${this.url}/fund/form/detail4dist`, {
      // return super.get(url, {
      proKey: 'apply',
      processInstanceId: applyId,
      fundType: fundType
    }, {
      loading: false
    })
  }
  // 查看进件详情
  getLoanDetail ({fundType, loanId=''}) {
    return super.post(`${this.url}/fund/form/detail4dist`, {
      proKey: 'loan',
      processInstanceId: loanId,
      fundType: fundType
    }, {
      loading: false
    })
  }
  // 查看业务监控中需求及借款进件详情
  getMonitorDetailData (params) {
    const url = `${this.url}/fund/form/viewDetail`
    return super.post(url, { ...params } , {
      loading: false
    })
  }
}

export default new FormApi()
