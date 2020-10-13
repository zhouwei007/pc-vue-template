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
            placeholder="状态"
          />
        </search-item>
        <search-item>
          <s-select
                  :options="isDirectOptions"
                  v-model="params.isDirect"
                  placeholder="是否直营"
          />
        </search-item>
      </search-bar>
      <search-bar>
        <search-item>
          <s-select
            :options="taskStatusMap"
            v-model="params.taskStatus"
            placeholder="任务状态"
            ref="taskStatus"
          />
        </search-item>
        <search-item>
          <s-input
            v-model="params.fundName"
            placeholder="资金方"
          />
        </search-item>
        <search-item>
          <s-input
            v-model="params.fundProductName"
            placeholder="产品"
          />
        </search-item>
        <!-- <search-item>
          <s-select
            :options="loanStatusMap"
            v-model="params.fundName"
            placeholder="资金方"
          />
        </search-item>
         <search-item>
          <s-select
            :options="loanStatusMap"
            v-model="params.fundProductName"
            placeholder="产品"
          />
        </search-item> -->
        <search-item>
          <date-picker
            v-model="time"
            label="申请日期"
            startholder="申请日期"
            endholder="申请日期"
          />
        </search-item>
         <search-item>
          <s-button @click="search(false)">搜索</s-button>
        </search-item>
        <search-item>
          <s-button @click="search(true)" type="default">清空</s-button>
        </search-item>
      </search-bar>
      <!-- <s-table :columns="columns" :source="source" :isLoading="loading" /> -->
      <s-table :columns="columns" :source="source" :isLoading="loading" >
        <template v-slot:opera="{ row }">
          <div class="opera">
            <a href="javascript:;" @click="opera(row.item)">办理</a>
            <span > | </span>
            <a :href="`https://yun.huli.com/saas-harbour/fund/loan/openProcImg?taskId=${row.item.taskId}`" target="_blank">流程图</a>
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
      isDirectOptions: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
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
        // {
        //   title: '申请金额(元)',
        //   render: (h, obj) => {
        //     return h('div', {}, Utils.formatMoney(obj.expectedAmount))
        //   }
        // },
        // {
        //   title: '申请期限',
        //   render: (h, obj) => {
        //     return h('div', {}, obj.expectedPeriodsStr)
        //   }
        // },
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
          title: '申请时间',
          render: (h, obj) => {
            return h('div', {}, Utils.fmtTime(obj.loanCreateTime, 'yyyy-MM-dd hh:mm:ss'))
          }
        },
        // {
        //   title: '推荐人',
        //   width: 124,
        //   render: (h, obj) => {
        //     return h('div', {}, obj.brokerAccountName)
        //   }
        // },
        {
          title: '状态',
          render: (h, obj) => {
            // let status = ''
            // this.loanStatusMap.map((item) => {
            //   if (String(item.value) === String(obj.approveStatus)) {
            //     status = item.label
            //   }
            // })
            return h('div', {}, obj.approveStatusStr)
          }
        },
        {
          title: '是否直营',
          render: (h, obj) => {
            // let status = ''
            // this.loanStatusMap.map((item) => {
            //   if (String(item.value) === String(obj.approveStatus)) {
            //     status = item.label
            //   }
            // })
            return h('div', {}, obj.isDirect?'是':'否')
          }
        },
        {
          title: '当前节点',
          render: (h, obj) => {
            // let status = ''
            // this.loanStatusMap.map((item) => {
            //   if (String(item.value) === String(obj.approveStatus)) {
            //     status = item.label
            //   }
            // })
            return h('div', {}, this.getNodeTypeName(obj.nodeTypeCode))
          }
        },
        {
          title: '任务状态',
          render: (h, obj) => {
            return h('div', {}, obj.taskStatusName)
          }
        },
        {
          title: '操作',
          slotName: 'opera'
          // render: (h, obj) => {
          //   return h('div', { class: 'opera' },
          //     [
          //       h('a', {
          //         on: {
          //           click: () => {
          //             this.opera(obj)
          //           }
          //         }
          //       }, '办理')
          //     ])
          // }
        }
      ],
      source: [],
      currentPage: 1, // 当前页码
      limit: 10, // 每页显示条数
      totalCount: 0, // 总页数
      time: {},
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
        isDirect: null
      },
      loading: true,
      loanStatusMap: [],
      NodeTypeList: []
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
    this.params.requireCode = this.$route.query.requireCode || ''
    this.init()
    this.getTaskStatus()
    this.getCityByUser()
    this.getTableData()
  },
  async created () {
    await this.findNodeTypeList()
  },
  computed: {
    ...mapState(['cityMap', 'taskStatusMap'])
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
      let start = this.time.start || ''
      let end = this.time.end || ''
      if (start > end && (![start, end].includes(''))) {
        return this.$refs.toast.show('进件开始日期需小于结束日期')
      }
      let params = {
        ...this.params,
        fundType: 'assistLoanD',
        page: {
          pageSize: this.limit,
          index: this.currentPage
        }
      }
      this.loading = true
      TaskApi.getBorrowList(params).then((data) => {
        this.totalCount = data.total
        this.source = data.list
      }).finally(() => {
        this.loading = false
      })
    },
    search (status) {
      if (status) {
        this.time = {}
        this.params = {
          requireCode: '',
          borrowName: '',
          borrowMobile: '',
          loanId: '',
          isDirect: null,
          applyCityId: '',
          approveStatus: '',
          fundName: '',
          fundProductName: '',
          applyCityName: '',
          taskStatus: ''
        }
      }
      this.currentPage = 1
      this.getTableData()
    },
    selectCity (obj) {
      this.params.applyCityName = obj.label
    },
    opera (obj) {
      window.open(`/harbour/static/#/demands/borrow/detail?loanId=${obj.loanIdStr}&approveStatusStr=${obj.approveStatusStr}&approveStatus=${obj.approveStatus}&proKey=${obj.proKey}&taskId=${obj.taskId}&nodeTypeCode=${obj.nodeTypeCode}&router=${this.$route.name}`, '_blank')
    },
    // 获取节点类型
    findNodeTypeList () {
      let params = {
        systemCode: 'harbour'
      }
      TaskApi.findNodeTypeList(params).then((data) => {
        this.NodeTypeList = data
      }).finally(() => {
        this.loading = false
      })
    },
    // 获取节点名称
    getNodeTypeName (nodeTypeCode) {
      let result = this.NodeTypeList.find((item) => {
        return item.nodeTypeCode == nodeTypeCode
      })
      if (result || result.nodeTypeName) {
        return result.nodeTypeName
      } else {
        return ''
      }
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
