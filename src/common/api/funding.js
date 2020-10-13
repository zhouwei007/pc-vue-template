import BaseRequest from '@/common/request'

class FundingApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/gateway/saas-harbour/fund'
  }

  // 资金方列表
  fundingList ({
    channel = '',
    name = '', // 资金方名称
    status = 1, // 状态 停用 0 启用 1
    pageSize = 10, // 每页长度
    index = 1 // 第几页
  }) {
    return super.post(`${this.url}/source/list`, {
      name,
      status,
      channel,
      pageSize,
      index
    }, {
      loading: false
    })
  }

  // 资金方产品列表
  productList ({
    name = '', // 资金方名称
    productName = '', // 产品名称
    productStatus = 1, // 状态 停用 0 启用 1
    wkShow = '',
    productType = '',
    cityId= '',
    pageSize = 10, // 每页大小
    index = 1 // 第几页
  }) {
    return super.post(`${this.url}/product/list`, {
      name,
      productName,
      productStatus,
      wkShow,
      productType,
      pageSize,
      cityId,
      index
    }, {
      loading: false
    })
  }

  // 产品详情、城市分配信息
  feeDetailList ({
    id
  }) {
    return super.post(`${this.url}/fee/detail/list`, {
      id: id
    }, {
      loading: false
    })
  }

  // 平台费用列表
  allotList ({
    name = '', // 资金方名称
    productName = '', // 产品名称
    status = 1, // 状态 停用 0 启用 1
    cityId = '', // 城市id
    platformConfirmStatus = '', // 平台状态 待收 0 已收 1
    rebateConfirmStatus = '', // 返佣状态 待收 0 已收 1
    requireCode = '', // 需求编号
    loanCode = '', // 借款编号
    borrowName = '' // 客户姓名
  }) {
    return super.post(`${this.url}/fee/allot/list`, {
      name,
      productName,
      status,
      cityId,
      platformConfirmStatus,
      rebateConfirmStatus,
      requireCode,
      loanCode,
      borrowName
    }, {
      loading: false
    })
  }

  // 资金方修改、新加
  fundingEdit (obj = {}) {
    return super.post(`${this.url}/source/confirm`, obj, {
      loading: false
    })
  }

  // 资金方产品修改、新加 
  productEdit (obj = {}) {
    return super.post(`${this.url}/product/confirm`, obj, {
      loading: false
    })
  }

  // 产品修改、新加 
  feeDetailEdit (obj = {}) {
    return super.post(`${this.url}/fee/detail/confirm`, obj, {
      loading: false
    })
  }
  // 产品页面获取资金方
  getFundName(obj = {}) {
    return super.post(`${this.url}/source/dropdown`, obj, {
      loading: false
    })
  }
  // 产品页面获取渠道方
  getChannelName(obj = {}) {
    return super.post(`${this.url}/channel/dropdown`, obj, {
      loading: false
    })
  }
  // 产品页面获取城市下拉框
  getCityName(obj = {}) {
    return super.post(`${this.url}/city/cityForProduct/dropdown`, obj, {
      loading: false
    })
  }
  // 产品分配页获取产品
  getProducts(obj = {}) {
    return super.post(`${this.url}/product/dropdown`, obj, {
      loading: false
    })
  }
  // 平台费用修改
  AllotEdit (obj = {}) {
    return super.post(`${this.url}/fee/allot/confirm`, obj, {
      loading: false
    })
  }
  
  // 获取城市(有权限)
  getCityNameByUser(obj = {}) {
    return super.post(`${this.url}/city/cityForUser/dropdown`, obj, {
      loading: false
    })
  }

  // 城市列表
  cityList (obj = {}) {
    return super.post(`${this.url}/city/city/list`, obj, {
      loading: false
    })
  }

  // 删除城市
  cityDel (obj = {}) {
    return super.post(`${this.url}/city/city/delete`, obj, {
      loading: false
    })
  }

  // 添加城市
  cityAdd (obj = {}) {
    return super.post(`${this.url}/city/city/confirm`, obj, {
      loading: false
    })
  }

  // 获取省
  getProvince (obj = {}) {
    return super.post(`${this.url}/city/province/dropdown`, obj, {
      loading: false
    })
  }

  // 获取市
  getCity (obj = {}) {
    return super.post(`${this.url}/city/city/dropdown`, obj, {
      loading: false
    })
  }

  // 渠道列表
  channelList (obj = {}) {
    return super.post(`${this.url}/channel/list`, obj, {
      loading: false
    })
  }

  // 获任务状态
  getTaskStatus (obj = {}) {
    return super.post(`${this.url}/operation/ajax/taskStatus`, obj, {
      loading: false
    })
  }

  // 渠道新增 修改 启用 停用
  channelConfirm (obj = {}) {
    return super.post(`${this.url}/channel/confirm`, obj, {
      loading: false
    })
  }

  // 产品保存
  productConfirm (obj = {}) {
    return super.post(`${this.url}/product/confirm`, obj, {
      loading: false
    })
  }

  // 资金需求列表
  applyList (params) {
    const url = `${this.url}/apply/all`
    return super.post(url, { ...params } , {
      loading: false
    })
  }

  // 借款需求列表
  loanList (params) {
    const url = `${this.url}/loan/all`
    return super.post(url, { ...params } , {
      loading: false
    })
  }

  // 资金需求任务列表
  applyTaskList (params) {
    const url = `${this.url}/apply/taskAll`
    return super.post(url, { ...params } , {
      loading: false
    })
  }
  
  // 借款需求任务列表
  loanTaskList (params) {
    const url = `${this.url}/loan/taskAll`
    return super.post(url, { ...params } , {
      loading: false
    })
  }

  // 线索列表
  cluesList (params) {
    const url = `${this.url}/apply/clueAll`
    return super.post(url, { ...params } , {
      loading: false
    })
  }

  getAssignUsers (params) {
    const url = `${this.url}/apply/listAssignUsers`
    return super.get(url, { ...params } , {
      loading: false
    })
  }

  assignTask (params) {
    const url = `${this.url}/apply/assignTaskBatch`
    return super.get(url, { ...params } , {
      loading: false
    })
  }

  changeTaskStatus (params) {
    const url = `${this.url}/apply/convertToTodo`
    return super.get(url, { ...params } , {
      loading: false
    })
  }
  getLoanAssignUsers (params) {
    const url = `${this.url}/loan/listAssignUsers`
    return super.get(url, { ...params } , {
      loading: false
    })
  }

  loanAssignTask (params) {
    const url = `${this.url}/loan/assignTaskBatch`
    return super.get(url, { ...params } , {
      loading: false
    })
  }

  changeLoanTaskStatus (params) {
    const url = `${this.url}/loan/convertToTodo`
    return super.get(url, { ...params } , {
      loading: false
    })
  }

  reAssignLoanTaskBatch (params) {
    const url = `${this.url}/loan/reAssignTaskBatch`
    return super.get(url, { ...params } , {
      loading: false
    })
  }

  reAssignApplyTaskBatch (params) {
    const url = `${this.url}/apply/reAssignTaskBatch`
    return super.get(url, { ...params } , {
      loading: false
    })
  }
}

export default new FundingApi()