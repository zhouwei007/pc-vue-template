import BaseRequest from 'common/request'

class PlatformApi extends BaseRequest {
  constructor (props) {
    super(props)
    this.url = '/gateway/saas-harbour/fund'
  }

  getPlatformList (params) {
    const url = `${this.url}/fee/allot/list`
    return super.post(url, { ...params } , {
      loading: false
    })
  }

  setConfirmStatus (params) {
    const url = `${this.url}/fee/allot/confirm`
    return super.post(url, { ...params } , {
      loading: false
    })
  }
}


export default new PlatformApi()