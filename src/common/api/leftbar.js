import BaseRequest from '@/common/request'

class LeftBarApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/gateway/saas-harbour'
  }

  getMenuList (params) {
    const url = `${this.url}/menu_list`
    return super.post(url, { ...params } , {
      loading: false
    })
  }
}

export default new LeftBarApi()