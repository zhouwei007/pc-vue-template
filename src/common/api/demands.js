import BaseRequest from '@/common/request'

class DemandsApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/gateway/saas-harbour'
  }
  // 获取进件模板
  getLoanTemplate () {
    return super.post(`${this.url}/fund/form/viewTemplate`, {
      proKey: 'loan',
      nodeType: 'loanIn'
    }, {
      loading: false
    })
  }
  // 保存进件数据
  saveLoanData ({loanId='', taskId, proKey, nodeType, requireCode, data={}}) {
    return super.post(`${this.url}/fund/form/saveTemplateData`, {
      loanId: loanId,
      taskId,
      proKey,
      nodeType,
      requireCode,
      data: data
    }, {
      loading: false
    })
  }
  // 提交数据
  submitLoanData ({loanId='', taskId, requireCode, proKey, nodeType, data={}}) {
    return super.post(`${this.url}/fund/form/completeTask`, {
      loanId: loanId,
      taskId,
      requireCode,
      proKey,
      nodeType,
      data: data
    }, {
      loading: false
    })
  }
  // 生成进件
  loanIn ({proKey='apply',applyId='', data={}}) {
    return super.post(`${this.url}/fund/form/loanIn`, {
      applyId: applyId,
      proKey: proKey,
      data: data
    }, {
      loading: false
    })
  }

  // 需求提交
  submit ({loanId='',taskId, prokey, nodeTypeCode, data={}}) {
    return super.post(`${this.url}/fund/form/submit`, {
      loanId: loanId,
      taskId,
      prokey,
      nodeTypeCode,
      data: data
    }, {
      loading: false
    })
  }

  // 进件登记
  completeTask ({loanId='', proKey, taskId, nodeTypeCode, data={}}) {
    return super.post(`${this.url}/fund/form/completeTask`, {
      loanId: loanId,
      proKey,
      taskId,
      nodeTypeCode,
      data: data
    }, {
      loading: false
    })
  }

  // 获取需求数据
  getLoadApplyData ({requireCode=''}) {
    return super.post(`${this.url}/task/loadApplyData`, {
      requireCode: requireCode
    }, {
      loading: false
    })
  }

  // 废弃需求,在需求办理页面点废弃按钮时调用
  abandonApply ({requireCode='', remark='废弃需求'}) {
    return super.post(`${this.url}/task/abandonApply`, {
      requireCode: requireCode,
      remark: remark
    }, {
      loading: false
    })
  }

  // 校验是否可以再次分配资金方，在点资金方按钮时调用
  canCreate ({requireCode='', fundType=''}) {
    return super.post(`${this.url}/allot/check/canCreate`, {
      requireCode: requireCode,
      fundType: fundType
    }, {
      loading: false
    })
  }

  // 获取分配资金方产品信息，校验可以分配资金方后调用此接口
  getLoadFundData ({requireCode='', fundType=''}) {
    return super.post(`${this.url}/allot/loadFundProduct`, {
      requireCode: requireCode,
      fundType: fundType
    }, {
      loading: false
    })
  }

  // 分配资金方，生成进件，在分配资金方页面点保存按钮调用
  createLoan ({
    requireCode='',
    fundId='',
    fundName='',
    fundProduct='',
    fundProductName='',
    borrowName='',
    expectedAmount='',
    period='',
    repayMethod='',
    repayMethodName='',
    id=''
  }) {
    return super.post(`${this.url}/allot/createLoan`, {
      requireCode: requireCode,
      fundId: fundId,
      fundName: fundName,
      fundProduct: fundProduct,
      fundProductName: fundProductName,
      borrowName: borrowName,
      expectedAmount: expectedAmount,
      period: period,
      repayMethod: repayMethod,
      repayMethodName: repayMethodName,
      subbranchId: id
    }, {
      loading: false
    })
  }

  // 删除进件，在分配资金方列表中调删除时调用
  deleteLoan ({loanId=''}) {
    return super.post(`${this.url}/allot/deleteLoan`, {
      loanId: loanId
    }, {
      loading: false
    })
  }

  // 保存任务表单
  saveData ({loanId='', data={}}) {
    return super.post(`${this.url}/fund/form/save4dist`, {
      taskId: loanId,
      data: data
    }, {
      loading: false
    })
  }

  // 提交任务表单
  submitTask ({loanId='', data={}}) {
    return super.post(`${this.url}/fund/form/submit4dist`, {
      taskId: loanId,
      data: data
    }, {
      loading: false
    })
  }

}

export default new DemandsApi()
