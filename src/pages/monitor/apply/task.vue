<template>
  <div class="loan-apply-list">
    <section>
      <search-bar>
        <search-item>
          <s-input
            v-model="params.requireCode"
            placeholder="需求编号"
            ref="requireCode"
          />
        </search-item>
        <search-item>
          <s-input
            v-model="params.borrowName"
            placeholder="客户姓名"
            ref="borrowName"
          />
        </search-item>
        <search-item>
          <s-select
            :options="nodeTypeMap"
            v-model="params.nodeTypeCode"
            placeholder="节点名称"
            ref="nodeTypeCode"
          />
        </search-item>
        <search-item>
          <s-select
            :options="taskStatusMap"
            v-model="params.taskStatus"
            placeholder="任务状态"
            ref="taskStatus"
          />
        </search-item>
        <search-item>
          <s-select
            :options="decisionMap"
            v-model="params.decision"
            placeholder="任务决策"
            ref="decision"
          />
        </search-item>
      </search-bar>
      <search-bar>
        <search-item>
          <date-picker
            v-model="applyDate"
            label="申请日期"
            startholder="申请起始日期"
            endholder="申请截止日期"
            ref="applyDate"
          />
        </search-item>
        <search-item>
          <date-picker
            v-model="claimTime"
            label="任务分派时间"
            startholder="任务分派时间(起)"
            endholder="任务分派时间(止)"
            ref="claimTime"
          />
        </search-item>
      </search-bar>
      <search-bar>
        <search-item>
          <s-input
            v-model="params.assignee"
            placeholder="办理人"
            ref="assignee"
          />
        </search-item>
        <search-item>
          <date-picker
            v-model="completeTime"
            label="办理完成时间"
            startholder="办理完成时间(起)"
            endholder="办理完成时间(止)"
            ref="completeTime"
          />
        </search-item>
         <search-item>
          <s-button @click="search(false)">搜索</s-button>
        </search-item>
        <search-item>
          <s-button @click="search(true)" type="default">清空</s-button>
        </search-item>
      </search-bar>
      <search-bar>
         <search-item>
          <s-button @click="assign">批量分/调派</s-button>
        </search-item>
        <search-item>
          <s-button @click="single">重新分单</s-button>
        </search-item>
      </search-bar>
      <s-table :columns="columns" :source="source" :isLoading="loading" @selectChange="selectChange" >
        <template v-slot:opera="{ row }">
          <div class="opera">
            <a href="javascript:;"  @click="opera(row.item)">详情</a>
            <a href="javascript:;"  @click="changeTodo(row.item)" v-if="row.item.taskStatus == 2">转为待办</a>
            <a :href="`https://yun.huli.com/saas-harbour/fund/apply/openProcImg?taskId=${row.item.taskId}`" target="_blank">流程图</a>
          </div>
        </template>
      </s-table>
    </section>
    <s-pagination
      :currentPage.sync="currentPage"
      :limit.sync="limit"
      :totalCount="totalCount"
      @change="getTableData"
    />
    <s-modal title="任务分派" v-model="model" @ok="ok" :hascancel="false">
      <modal-conent :data="batchData" v-model="batchParams" :origAssignee="origAssignee" @setShow="setShow"></modal-conent>
    </s-modal>
    <Toast ref="toast"></Toast>
  </div>
</template>

<script>
import BS from '@/common/bs'
import { mapState, mapActions } from 'vuex'
import TaskApi from '@/common/api/task'
import FundingApi from '@/common/api/funding'
import Select from '@/components/Select'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import Pagination from '@/components/Pagination'
import DatePicker from '@/components/RangeDatePicker'
import Toast from '@/components/Toast'
import { SearchBar, SearchItem } from '@/components/SearchBar/index'
import Utils from '@/common/utils'
import ModalConent from '../common/modalContent'
import Confirm from '@/components/Confirm'
function getDMS(time) {
  return parseInt(time / 3600.0) + '小时' + parseInt((parseFloat(time / 3600.0) -
    parseInt(time / 3600.0)) * 60) + '分钟' +
    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
      parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒'
}
function millisecondToDate (msd) {
  if (isNaN(msd)) {
    return ''
  }
  let time = parseFloat(msd) / 1000
  if (null !== time && '' !== time) {
    if (time > 60 && time < 60 * 60) { // 分+秒
      time = parseInt(time / 60.0) + '分钟' + parseInt((parseFloat(time / 60.0) -
        parseInt(time / 60.0)) * 60) + '秒'
    } else if (time >= 60 * 60 && time < 60 * 60 * 24) { // 时 + 分 + 秒
      time = parseInt(time / 3600.0) + '小时' + parseInt((parseFloat(time / 3600.0) -
        parseInt(time / 3600.0)) * 60) + '分钟' +
        parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒'
    } else if( time > 60 * 60 * 24) { // 天 + 时 + 分 + 秒
      let day = parseInt(time / (3600*24));
      let lastTime = getDMS(parseInt(time - day*24*60*60));
      time = `${day}天${lastTime}`
    }
    else {
      time = parseInt(time) + '秒'
    }
  }
  return time
}
export default {
  data () {
    return {
      columns: [
        {
          title: '序号',
          render: (h, obj, index) => {
            return h('div', {}, index + 1)
          }
        },
        {
          title: '选择',
          type: 'checkbox'
        },
        {
          title: '任务编号',
          render: (h, obj) => {
            return h('div', {}, obj.taskId)
          }
        },
        {
          title: '节点名称',
          render: (h, obj) => {
            return h('a', { class: 'opera' }, obj.nodeTypeName)
          }
        },
        {
          title: '任务状态',
          render: (h, obj) => {
            return h('a', { }, obj.taskStatusName)
          }
        },
        {
          title: '任务决策',
          render: (h, obj) => {
            return h('a', { }, obj.decision)
          }
        },
        {
          title: '需求编号',
          render: (h, obj) => {
            return h('div', {}, obj.requireCode)
          }
        },
        {
          title: '客户姓名',
          key: 'borrowName',
          render: (h, obj) => {
            return h('div', {}, obj.borrowName)
          }
        },
        {
          title: '分派时间',
          render: (h, obj) => {
            return h('div', {}, Utils.fmtTime(obj.taskCreateTime, 'yyyy-MM-dd hh:mm:ss'))
          }
        },
        {
          title: '办理人',
          render: (h, obj) => {
            return h('div', {}, obj.assignee)
          }
        },
        {
          title: '办理开始时间',
          render: (h, obj) => {
            return h('div', {}, Utils.fmtTime(obj.claimTime, 'yyyy-MM-dd hh:mm:ss'))
          }
        },
        {
          title: '办理完成时间',
          render: (h, obj) => {
            return h('div', {}, Utils.fmtTime(obj.completeTime, 'yyyy-MM-dd hh:mm:ss'))
          }
        },
        {
          title: '工作时长',
          render: (h, obj) => {
            return h('div', {}, millisecondToDate(obj.completeTime - obj.claimTime))
          }
        },
        {
          title: '操作',
          slotName: 'opera'
        }
      ],
      source: [],
      currentPage: 1, // 当前页码
      limit: 10, // 每页显示条数
      totalCount: 0, // 总页数
      applyDate: {},
      claimTime: {},
      completeTime: {},
      params: {
        requireCode: '',
        borrowName: '',
        nodeTypeCode: '',
        taskStatus: '',
        decision: '',
        assignee: ''
      },
      loading: true,
      decisionMap: [],
      nodeTypeMap: [],
      model: false,
      currentTasks: [],
      batchData: [],
      origAssignee: '',
      batchParams: {}
    }
  },
  components: {
    SSelect: Select,
    SInput: Input,
    SButton: Button,
    STable: Table,
    SModal: Modal,
    SPagination: Pagination,
    DatePicker,
    SearchBar,
    SearchItem,
    Toast,
    ModalConent
  },
  computed: {
    ...mapState(['cityMap', 'taskStatusMap'])
  },
  mounted () {
    this.init()
    this.getCityByUser()
    this.getTaskStatus()
    this.getNodeType()
    this.getTableData()
  },
  methods: {
    ...mapActions({
      getCityByUser: 'getCityByUser',
      getTaskStatus: 'getTaskStatus'
    }),
    async init () {
      this.decisionMap = await BS.getOptions('saas_fund_apply_decision')
    },
    getTableData () {
      this.currentTasks = []
      this.params.timeStart = this.applyDate.start ? Utils.fmtTime(this.applyDate.start, 'yyyy-MM-dd') : ''
      this.params.timeEnd = this.applyDate.end ? Utils.fmtTime(this.applyDate.end, 'yyyy-MM-dd') : ''
      let start = this.applyDate.start || ''
      let end = this.applyDate.end || ''
      if (start > end && (![start, end].includes(''))) {
        return this.$refs.toast.show('申请起始日期需小于截止日期')
      }
      this.params.claimStart = this.claimTime.start ? Utils.fmtTime(this.claimTime.start, 'yyyy-MM-dd') : ''
      this.params.claimEnd = this.claimTime.end ? Utils.fmtTime(this.claimTime.end, 'yyyy-MM-dd') : ''
      start = this.claimTime.start || ''
      end = this.claimTime.end || ''
      if (start > end && (![start, end].includes(''))) {
        return this.$refs.toast.show('任务分派起始时间需小于截止时间')
      }
      this.params.completeStart = this.completeTime.start ? Utils.fmtTime(this.completeTime.start, 'yyyy-MM-dd') : ''
      this.params.completeEnd = this.completeTime.end ? Utils.fmtTime(this.completeTime.end, 'yyyy-MM-dd') : ''
      start = this.completeTime.start || ''
      end = this.completeTime.end || ''
      if (start > end && (![start, end].includes(''))) {
        return this.$refs.toast.show('办理完成起始时间需小于截止时间')
      }
      let params = {
        ...this.params,
        page: {
          pageSize: this.limit,
          index: this.currentPage
        }
      }
      this.loading = true
      FundingApi.applyTaskList(params).then((data) => {
        this.totalCount = data.total || 0
        this.source = data.list || []
      }).finally(() => {
        this.loading = false
      })
    },
    getNodeType () {
      TaskApi.findNodeTypeList({
        systemCode: 'harbour'
      }).then((data) => {
        this.nodeTypeMap = data.map(item => ({
          label: item.nodeTypeName,
          value: item.nodeTypeCode
        }))
      })
    },
    search (status) {
      if (status) {
        this.params = {
          requireCode: '',
          borrowName: '',
          nodeTypeCode: '',
          taskStatus: '',
          decision: '',
          assignee: ''
        }
        this.applyDate = {}
        this.claimTime = {}
        this.completeTime = {}
      }
      this.currentPage = 1
      this.getTableData()
    },
    selectChange (taskIds) {
      this.currentTasks = taskIds
    },
    assign () {
      if (this.currentTasks.length < 1) {
        return this.$refs.toast.show('请选择任务')
      }
      this.getBatch()
    },
    getBatch () {
      let params = this.currentTasks.join(',')
       FundingApi.getAssignUsers({ taskIds: params }).then((data) => {
        if (data.code && data.code !== '200') {
          return this.$refs.toast.show(data.msg)
        }
        this.model = true
        this.batchData = data.orgUsers || []
        this.origAssignee = data.origAssignee || ''
        if (Array.isArray(this.batchData) && this.batchData[0]) {
          this.batchData[0].show = true
        }
      }).finally(() => {
        this.loading = false
      })
    },
    setShow (index) {
      this.batchData.map((item) => {
        item.show = false
      })
      this.batchData[index].show = true
      this.batchData = Object.assign([], this.batchData)
    },
    ok () {
      let taskIds = this.currentTasks.join(',')
      let params = {
        ...this.batchParams,
        taskIds: taskIds,
        userCode: this.batchParams.assignee
      }
      if (!this.batchParams.assignee) {
        return this.$refs.toast.show('用户姓名必选')
      }
      if (!this.batchParams.note) {
        return this.$refs.toast.show('操作备注必填')
      }
      FundingApi.assignTask(params).then((data) => {
        this.$refs.toast.show(data.msg)
        this.getTableData()
      }).finally(() => {
        this.model = false
      })
    },
    changeTodo (obj) {
      Confirm.show({
        title: '提示',
        message: '确认要转为待办吗?',
        handleSubmit: this.todoOk.bind(this, obj)
      })
    },
    todoOk (obj) {
      FundingApi.changeTaskStatus({ taskId: obj.taskId }).then(() => {
        this.$refs.toast.show('转为待办成功')
        this.getTableData()
      }).catch((data) => {
        this.$refs.toast.show(data)
      })
    },
    opera (obj) {
      let requireCode = obj.requireCode
      window.open(`/harbour/static/#/monitor/apply/detail?requireCode=${requireCode}&proKey=apply`, '_blank')
    },
    single () {
      let taskIds = this.currentTasks.join(',')
      if (this.currentTasks.length < 1) {
        return this.$refs.toast.show('请选择任务')
      }
      FundingApi.reAssignApplyTaskBatch({ taskIds }).then((data) => {
        this.$refs.toast.show(data.msg, 2000)
        this.getTableData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .loan-apply-list {
    // width: 100%;
    min-height: 730px;
    background: #ffffff;
    padding: 15px 30px;
    .filter-box {
      display: flex;
      .select {
        margin: 0 10px 10px 0;
      }
    }
  }
</style>
