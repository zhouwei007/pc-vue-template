import BaseRequest from '@/common/request'

class RoleApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/gateway/saas-harbour'
  }

  // 角色列表
  roleList (obj = {}) {
    return super.get(`${this.url}/role/list`, obj, {
      loading: false
    })
  }

  // 创建角色
  roleAdd (obj = {}) {
    return super.post(`${this.url}/role/create`, obj, {
      loading: false
    })
  }

  // 编辑角色
  roleEdit (obj = {}) {
    return super.post(`${this.url}/role/edit`, obj, {
      loading: false
    })
  }


  // 用户列表
  userList (obj = {}) {
    return super.get(`${this.url}/account/list`, obj, {
      loading: false
    })
  }


  // 编辑用户
  userAdd (obj = {}) {
    return super.post(`${this.url}/account/create`, obj, {
      loading: false
    })
  }

  // 添加用户
  userEdit (obj = {}) {
    return super.post(`${this.url}/account/edit`, obj, {
      loading: false
    })
  }

  // 获取当前用户信息
  ownerInfo (obj = {}) {
    return super.get(`${this.url}/account/info`, obj, {
      loading: false
    })
  }
}

export default new RoleApi()