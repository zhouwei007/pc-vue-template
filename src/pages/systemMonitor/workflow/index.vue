<template>
  <div class="loan-apply-list">
    <section>
      <search-bar>
        <search-item>
          <s-select
            isSearch
            :options='productMap'
            v-model="params.bizCode"
            placeholder="产品类型"
          />
        </search-item>
        <search-item>
          <s-select
                  isSearch
                  :options='workflowMap'
                  v-model="params.processName"
                  placeholder="工作流名称"
          />
        </search-item>
        <search-item>
          <s-select
                  :options="statusMap"
                  v-model="params.instStatus"
                  placeholder="状态"
          />
        </search-item>
        <search-item>
          <s-input
                  v-model="params.loanId"
                  placeholder="业务id"
          />
        </search-item>
        <search-item>
          <s-input
                  v-model="params.currNodeName"
                  placeholder="节点名称"
          />
        </search-item>
      </search-bar>
      <search-bar>
        <search-item>
          <date-picker
            v-model="time"
            startholder="开启时间"
            endholder="开启时间"
          />
        </search-item>
        <search-item>
          <s-button @click="search">搜索</s-button>
        </search-item>
      </search-bar>
      <s-table :columns="columns" :source="source" :isLoading="loading">
        <template v-slot:order="{ row }">
          <div>
            {{row.index + 1}}
          </div>
        </template>
        <template v-slot:opera="{ row }">
          <div class="opera">
            <a :href="`/saas-harbour/monitor/openProcImg?processInstanceId=${row.item.processInstanceId}`" target="_blank" >流程图</a><span> | </span>
            <a :href="`/harbour/static/#/systemMonitor/workflowHistory??processInstanceId=${row.item.processInstanceId}&paraId=${row.item.paraId}`" target="_blank">历史</a>
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
  import { mapState, mapActions } from 'vuex'
  import systemMonitorApi from '@/common/api/systemMonitor'
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
    template: '.workflow-list',
    data () {
      return {
        columns: [
          {
            title: '序号',
            width: 80,
            slotName: 'order'
          },
          {
            title: '产品类型',
            width: 124,
            render: (h, obj) => {
              return h('div', {}, obj.bizName)
            }
          },
          {
            title: '业务id',
            width: 124,
            render: (h, obj) => {
              return h('div', {}, obj.businessKey)
            }
          },
          {
            title: '工作流名称',
            width: 124,
            render: (h, obj) => {
              return h('div', {}, obj.processName)
            }
          },
          {
            title: '状态',
            width: 124,
            render: (h, obj) => {
              return h('div', {}, obj.instStatusName)
            }
          },
          {
            title: '当前节点',
            width: 200,
            render: (h, obj) => {
              return h('div', {}, obj.currActName)
            }
          },
          {
            title: '节点类型',
            width: 200,
            render: (h, obj) => {
              return h('div', {}, obj.currNodeName)
            }
          },
          {
            title: '工作流开启时间',
            width: 124,
            render: (h, obj) => {
              return h('div', {}, Utils.fmtTime(obj.startTime, 'yyyy-MM-dd hh:mm:ss'))
            }
          },
          {
            title: '工作流结束时间',
            width: 124,
            render: (h, obj) => {
              return h('div', {}, Utils.fmtTime(obj.endTime, 'yyyy-MM-dd hh:mm:ss'))
            }
          },
          {
            title: '查看',
            width: 124,
            slotName: 'opera'
          }
        ],
        source: [],
        currentPage: 1, // 当前页码
        limit: 10, // 每页显示条数
        totalCount: 0, // 总页数
        time: {},
        statusMap: [
          {
            label: '执行中',
            value: 1
          },
          {
            label: '已结束',
            value: 2
          },
          {
            label: '错误',
            value: 3
          }
        ],
        params: {
          bizCode: '',
          processName: '',
          instStatus: '',
          loanId: '',
          currNodeName: '',
          startTimeS: '',
          startTimeE: ''
        },
        loading: true
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
      this.getWorkflow()
      this.getProduct();
      this.getTableData()
    },
    computed: {
      ...mapState(['productMap', 'workflowMap'])
    },
    methods: {
      ...mapActions(['getProduct', 'getWorkflow']),
      getTableData () {
        this.params.startTimeS = this.time.start ? Utils.fmtTime(this.time.start, 'yyyy-MM-dd') : ''
        this.params.startTimeE = this.time.end ? Utils.fmtTime(this.time.end, 'yyyy-MM-dd') : ''
        let start = this.time.start || ''
        let end = this.time.end || ''
        if (start > end && (![start, end].includes(''))) {
          return this.$refs.toast.show('开始日期需小于结束日期')
        }
        let params = {
          ...this.params,
          pageSize: this.limit,
          pageNo: this.currentPage
        }
        this.loading = true
        systemMonitorApi.listMonitorPage(params).then(data => {
          this.totalCount = data.total
          this.source = data.list
          this.loading = false
        }).catch( err => {
          this.$refs.toast.show(err)
        })
      },
      search () {
        this.currentPage = 1
        this.getTableData()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sass-select::v-deep{
    width: 188px;
  }
  .loan-apply-list {
    width: 100%;
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
