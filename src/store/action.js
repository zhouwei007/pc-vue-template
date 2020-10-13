import AuthApi from 'common/api/auth.js'
import systemMonitorApi from '@/common/api/systemMonitor'
import FundingApi from 'common/api/funding.js'
import LeftBarApi from 'common/api/leftbar.js'
import BS from '@/common/bs'
const actions = {
  // 登录
  login ({ commit }, userInfo) {
    const param = {
      username: userInfo.username,
      password: userInfo.password
    }
    return AuthApi.login(param).then((data) => {
      commit('setLoginInfo', data)
    })
  },
  // 登出
  logout ({ commit }) {
    return AuthApi.logout().then(() => {
      commit('setAuthorization', {})
      commit('setLoginInfo', '')
    })
  },

  // 获取申请城市
  getCityByUser ({ commit }, params) {
    return FundingApi.getCityNameByUser(params).then((data) => {
      commit('setCityByUser', data)
    })
  },

  // 获取任务状态
  getTaskStatus ({ commit }, params) {
    return FundingApi.getTaskStatus(params).then((data) => {
      commit('setTaskStatus', data)
    })
  },
  // 工作流名称
  getWorkflow ({ commit }) {
    return systemMonitorApi.listProcess().then((data) => {
      let temp = []
      if (Array.isArray(data)) {
        data && data.map((item) => {
          temp.push({
            label: item.name,
            value: item.name
            // value: item.procKey
          })
        })
      }
      commit('setWorkflowMap', temp)
    })
  },
  // 产品名称
  getProduct ({ commit }) {
    return systemMonitorApi.findBizCodeDictPerm().then((data) => {
      let temp = []
      if (Array.isArray(data)) {
        data && data.map((item) => {
          temp.push({
            label: item.name,
            value: item.code
          })
        })
      }
      commit('setProductMap', temp)
    })
  },
  // 办理决策
  getDecisionType ({ commit }, params = {}) {
    systemMonitorApi.loadCodeItems(params).then(data => {
      let temp = []
      Array.isArray(data) && data.map((item) => {
        temp.push({
          label: item.name,
          value: item.code
        })
      })
      commit('setDecisionType', temp)
    }).catch(err => {
      throw new Error(err)
    })
  },
  // 获取左侧菜单配置
  async getMenuList ({ commit }, params) {
    params = {
      sysType: 'use',
      systemCode: 'harbour'
    }
    this.loading = true
    await LeftBarApi.getMenuList(params).then((data) => {
      commit('setLeftBar', data.routerData)
    })
  },

  // 获取BS校验配置
  async getParaFormatCheck ({ commit }) {
    let codeAll = await BS.getCodeAll()
    let tempObj = codeAll.paraFormatCheck
    let tempCheck = {}
    for (let key in tempObj.items) {
      tempCheck[key] = tempObj.items[key].remark
    }
    if (tempCheck['idCard'] === 'checkIdCard') {
      tempCheck['idCard'] = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    }
    commit('setParaFormatCheck', tempCheck)
  }
}
export default actions
