import BaseRequest from 'common/request'

class TaskApi extends BaseRequest {
  constructor (props) {
    super(props)
    this.url = '/gateway/saas-harbour/fund'
  }

  getHumanTaskList (params) {
    const url = `${this.url}/apply/humantask`
    return super.post(url, { ...params } , {
      loading: false
    })
  }

  getFundDemandList (params) {
    const url = `${this.url}/apply/list`
    return super.post(url, { ...params } , {
      loading: false
    })
  }
  getBorrowList (params) {
    const url = `${this.url}/loan/humantask`
    return super.post(url, { ...params } , {
      loading: false
    })
  }
  getBorrowLogList (params) {
    const url = `${this.url}/operate/log/list`
    return super.post(url, { ...params } , {
      loading: false
    })
  }
  findNodeTypeList (params) {
    const url = `${this.url}/operation/ajax/findNodeTypeList`
    return super.post(url, { ...params } , {
      loading: false
    })
  }
  getDetailData (params) {
    const url = `${this.url}/form/viewDetail`
    return super.post(url, { ...params } , {
      loading: false
    })
  }
}


export default new TaskApi()