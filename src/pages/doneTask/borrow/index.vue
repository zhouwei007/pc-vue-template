<template>
  <div class="loan-apply-list">
    <section>
      <search-bar>
        <search-item>
          <s-input
            v-model="params.requireCode"
            placeholder="需求编号"
          />
        </search-item>
        <search-item>
          <s-input
            v-model="params.borrowName"
            placeholder="客户姓名"
          />
        </search-item>
        <search-item>
          <s-input
            v-model="params.borrowMobile"
            placeholder="客户手机号码"
          />
        </search-item>
        <search-item>
          <s-input
            v-model="params.loanId"
            placeholder="借款编号"
          />
        </search-item>
        <search-item>
          <s-input
            v-model="params.fundName"
            placeholder="资金方"
          />
        </search-item>
      </search-bar>
      <search-bar>
        <search-item>
          <s-input
            v-model="params.fundProductName"
            placeholder="产品名称"
          />
        </search-item>
        <search-item>
          <s-select
            :options='cityMap'
            v-model="params.applyCityId"
            placeholder="申请城市"
            @change="selectCity"
          />
        </search-item>
        <search-item>
          <s-select
            :options="loanStatusMap"
            v-model="params.approveStatus"
            placeholder="借款状态"
          />
        </search-item>
        <search-item>
          <s-select
            :options="nodeTypeMap"
            v-model="params.nodeTypeCode"
            placeholder="当前节点"
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
      </search-bar>
      <search-bar>
        <search-item>
          <date-picker
                  v-model="time"
                  label="进件时间"
                  startholder="进件时间"
                  endholder="进件时间"
          />
        </search-item>
        <search-item>
          <date-picker
                  v-model="loanTime"
                  label="放款时间"
                  startholder="放款时间"
                  endholder="放款时间"
          />
        </search-item>
      </search-bar>
      <search-bar>
        <search-item>
          <s-button @click="search(false)">搜索</s-button>
        </search-item>
        <search-item>
          <s-button @click="search(true)" type="default">清空</s-button>
        </search-item>
      </search-bar>
      <s-table :columns="columns" :source="source" :isLoading="loading" >
         <template v-slot:opera="{ row }">
          <div class="opera">
            <a href="javascript:;"  @click="opera(row.item)">详情</a>
            <a :href="`https://yun.huli.com/saas-harbour/fund/loan/openProcImgByLoanId?loanId=${row.item.loanIdStr}`" target="_blank">流程图</a>
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
import Pagination from '@/components/Pagination'
import DatePicker from '@/components/RangeDatePicker'
import Toast from '@/components/Toast'
import { SearchBar, SearchItem } from '@/components/SearchBar/index'
import Utils from '@/common/utils'
export default {
  template: 'borrow-list',
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
          title: '借款编号',
          render: (h, obj) => {
            return h('div', {}, obj.loanIdStr)
          }
        },
        {
          title: '客户姓名',
          render: (h, obj) => {
            return h('div', {}, obj.borrowName)
          }
        },
        {
          title: '客户手机号',
          render: (h, obj) => {
            return h('div', {}, obj.borrowMobile)
          }
        },
        {
          title: '资金方',
          render: (h, obj) => {
            return h('div', {}, obj.fundName)
          }
        },
        {
          title: '产品',
          render: (h, obj) => {
            return h('div', {}, obj.fundProductName)
          }
        },
        {
          title: '申请城市',
          render: (h, obj) => {
            return h('div', {}, obj.applyCityName)
          }
        },
        {
          title: '申请时间',
          render: (h, obj) => {
            return h('div', {}, Utils.fmtTime(obj.applyTime, 'yyyy-MM-dd hh:mm:ss'))
          }
        },
        {
          title: '审批金额(元)',
          render: (h, obj) => {
            return h('div', {}, Utils.formatMoney(obj.approveAmount))
          }
        },
        {
          title: '审批期限',
          render: (h, obj) => {
            return h('div', {}, obj.approvePeriodsStr)
          }
        },
        {
          title: '放款时间',
          render: (h, obj) => {
            return h('div', {}, Utils.fmtTime(obj.loanTime, 'yyyy-MM-dd hh:mm:ss'))
          }
        },
        {
          title: '借款状态',
          render: (h, obj) => {
            return h('div', {}, obj.approveStatusStr)
          }
        },
        // {
        //   title: '当前节点',
        //   render: (h, obj) => {
        //     return h('div', {}, this.getNodeTypeName(obj.nodeTypeCode))
        //   }
        // },
        // {
        //   title: '任务状态',
        //   render: (h, obj) => {
        //     return h('div', {}, obj.taskStatusName)
        //   }
        // },
        {
          title: '操作',
          slotName: 'opera'
        }
      ],
      source: [],
      currentPage: 1, // 当前页码
      limit: 10, // 每页显示条数
      totalCount: 0, // 总页数
      time: {},
      loanTime: {},
      params: {
        requireCode: '',
        borrowName: '',
        borrowMobile: '',
        loanId: '',
        applyCityId: '',
        applyCityName: '',
        approveStatus: '',
        fundName: '',
        fundProductName: '',
        taskStatus: '',
        nodeTypeCode: ''
      },
      loading: true,
      loanStatusMap: [],
      nodeTypeMap: []
    }
  },
  components: {
    SSelect: Select,
    SInput: Input,
    SButton: Button,
    STable: Table,
    SPagination: Pagination,
    DatePicker,
    SearchBar,
    SearchItem,
    Toast
  },
  mounted () {
    this.init()
    this.getTaskStatus()
    this.getCityByUser()
    this.getTableData()
  },
  async created () {
    await this.findNodeTypeList()
  },
  computed: {
    ...mapState(['cityMap', 'taskStatusMap', 'loginInfo'])
  },
  methods: {
    ...mapActions({
      getCityByUser: 'getCityByUser',
      getTaskStatus: 'getTaskStatus'
    }),
    async init () {
      let codeAll = await BS.getCodeAll()
      let statusMap = codeAll.saas_fund_loan_status
      this.loanStatusMap = []
      statusMap && statusMap.items && Object.keys(statusMap.items).map((item) => {
        this.loanStatusMap.push({
          value: statusMap.items[item].codeValue,
          label: statusMap.items[item].codeName
        })
      })
    },
    getTableData () {
      this.params.timeStart = this.time.start ? Utils.fmtTime(this.time.start, 'yyyy-MM-dd') : ''
      this.params.timeEnd = this.time.end ? Utils.fmtTime(this.time.end, 'yyyy-MM-dd') : ''
      this.params.loanTimeStart = this.loanTime.start ? Utils.fmtTime(this.loanTime.start, 'yyyy-MM-dd') : ''
      this.params.loanTimeEnd = this.loanTime.end ? Utils.fmtTime(this.loanTime.end, 'yyyy-MM-dd') : ''
      let start = this.time.start || ''
      let end = this.time.end || ''
      if (start > end && (![start, end].includes(''))) {
        return this.$refs.toast.show('进件开始日期需小于结束日期')
      }
      let params = {
        ...this.params,
        assignee: this.loginInfo.username,
        page: {
          pageSize: this.limit,
          index: this.currentPage
        }
      }
      this.loading = true
      FundingApi.loanList(params).then((data) => {
        this.totalCount = data.total
        this.source = data.list
      }).finally(() => {
        this.loading = false
      })
    },
    search (status) {
      if (status) {
        this.time = {}
        this.loanTime = {}
        this.params = {
          requireCode: '',
          borrowName: '',
          borrowMobile: '',
          loanId: '',
          applyCityId: '',
          approveStatus: '',
          fundName: '',
          fundProductName: '',
          applyCityName: '',
          taskStatus: '',
          nodeTypeCode: ''
        }
      }
      this.currentPage = 1
      this.getTableData()
    },
    selectCity (obj) {
      this.params.applyCityName = obj.label
    },
    // 获取节点类型
    findNodeTypeList () {
      let params = {
        systemCode: 'harbour'
      }
      TaskApi.findNodeTypeList(params).then((data) => {
        this.nodeTypeMap = data.map(item => ({
          label: item.nodeTypeName,
          value: item.nodeTypeCode
        }))
      }).finally(() => {
        this.loading = false
      })
    },
    // 获取节点名称
    getNodeTypeName (nodeTypeCode) {
      let result = this.nodeTypeMap.find((item) => {
        return item.value == nodeTypeCode
      })
      if (result || result.nodeTypeName) {
        return result.nodeTypeName
      } else {
        return ''
      }
    },
    opera (obj) {
      let loanId = obj.loanIdStr
      window.open(`/harbour/static/#/doneTask/borrow/detail?loanId=${loanId}&proKey=loan`, '_blank')
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
