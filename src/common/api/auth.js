import BaseRequest from '@/common/request'
class AuthApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/gateway/saas-harbour/auth'
  }

  login ({username = '', password = '' }) {
    return super.post(`${this.url}/login`, {
      username,
      password
    }, {
      loading: false
    })
  }

  logout () {
    return super.post(`${this.url}/logout`, {}, {
      loading: false
    })
  }
}

export default new AuthApi()