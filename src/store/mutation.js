const mutations = {
  // 登录信息
  setLoginInfo (state, loginInfo) {
    state.loginInfo = { ...loginInfo }
  },
  // 正则
  setParaFormatCheck (state, payload) {
    state.paraFormatCheck = payload
  },

  // oauth信息
  setAuthorization (state, payload) {
    state.authorization = payload
  },

  // 获取申请城市
  setCityByUser (state, payload) {
    state.cityMap = payload
  },
  // 业务名称（产品名称）
  setProductMap (state, payload) {
    state.productMap = payload
  },
  // 工作流名称
  setWorkflowMap (state, payload) {
    state.workflowMap = payload
  },
  // 获取任务状态
  setTaskStatus (state, payload) {
    state.taskStatusMap = payload
  },
  // 获取左侧测单
  setLeftBar (state, routerData) {
    state.leftBar = routerData
  },
  // 存贮高级交互对象
  setDescribe(state, payload) {
    state.describe = payload.describe;
  },
  // 存贮表单list数据
  setFormGroupList(state, payload) {
    state.formGroupList = payload.data;
  },
  // 办理决策
  setDecisionType (state, payload) {
    state.decisionTypeMap = payload
  }
}
export default mutations
