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
          <s-input
            v-model="params.borrowMobile"
            placeholder="客户手机号"
            ref="borrowMobile"
          />
        </search-item>
        <search-item>
          <s-input
            v-model="params.brokerAccountName"
            placeholder="推荐人"
            ref="brokerAccountName"
          />
        </search-item>
        <search-item>
          <s-select
            :options='cityMap'
            v-model="params.applyCityId"
            placeholder="申请城市"
            ref="applyCityId"
            @change="selectCity"
          />
        </search-item>
      </search-bar>
      <search-bar>
        <search-item>
          <s-select
            :options="demandsStatusMap"
            v-model="params.applyStatus"
            placeholder="状态"
            ref="applyStatus"
          />
        </search-item>
        <search-item>
          <s-select
                  :options="isDirectOptions"
                  v-model="params.isDirect"
                  placeholder="是否直营"
          />
        </search-item>
        <search-item>
          <date-picker
            v-model="time"
            label="申请日期"
            startholder="申请日期"
            endholder="申请日期"
            ref="borrowName"
          />
        </search-item>
         <search-item>
          <s-button @click="search(false)">搜索</s-button>
        </search-item>
        <search-item>
          <s-button @click="search(true)" type="default">清空</s-button>
        </search-item>
      </search-bar>
      <s-table :columns="columns" :source="source" :isLoading="loading" />
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
  template: '.loan-apply-list',
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
          title: '客户手机号',
          render: (h, obj) => {
            return h('div', {}, obj.borrowMobile)
          }
        },
        {
          title: '申请金额(元)',
          render: (h, obj) => {
            return h('div', {}, Utils.formatMoney(obj.expectedAmount))
          }
        },
        {
          title: '申请期限',
          render: (h, obj) => {
            return h('div', {}, obj.expectedPeriodsStr)
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
          title: '推荐人',
          render: (h, obj) => {
            return h('div', {}, obj.brokerAccountName)
          }
        },
        {
          title: '销售',
          render: (h, obj) => {
            return h('div', {}, obj.userType === 1 ? obj.brokerAccountName : obj.saleAccountName)
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
          title: '状态',
          render: (h, obj) => {
            return h('a', { class: 'opera' }, obj.applyStatusStr)
          }
        }
      /*  {
          title: '操作',
          render: (h, obj) => {
            return h('div', { class: 'opera' },
              [
                h('a', {
                  on: {
                    click: () => {
                      this.opera(obj)
                    }
                  }
                }, '办理')
              ])
          }
        }*/
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
        applyCityId: '',
        applyCityName: '',
        applyStatus: '',
        isDirect: null,
        brokerAccountName: ''
      },
      loading: true,
      demandsStatusMap: [],
      srcList: [
        {
          label: '北京',
          key: '100000'
        },{
          label: '天津',
          key: '100001'
        },{
          label: '河北',
          key: '100002'
        },{
          label: '河南',
          key: '100003'
        },{
          label: '安徽',
          key: '100004'
        },{
          label: '江苏',
          key: '100005'
        }
      ]
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
  computed: {
    ...mapState(['cityMap'])
  },
  mounted () {
    this.init()
    this.getCityByUser()
    this.getTableData()
  },
  methods: {
    ...mapActions({
      getCityByUser: 'getCityByUser'
    }),
    async init () {
      let codeAll = await BS.getCodeAll()
      let statusMap = codeAll.saas_fund_apply_status
      this.demandsStatusMap = []
      statusMap && statusMap.items && Object.keys(statusMap.items).map((item) => {
        this.demandsStatusMap.push({
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
        fundType: 'organization',
        page: {
          pageSize: this.limit,
          index: this.currentPage
        }
      }
      this.loading = true
      TaskApi.getFundDemandList(params).then((data) => {
        this.totalCount = data.total || 0
        this.source = data.list || []
      }).finally(() => {
        this.loading = false
      })
    },
    search (status) {
      if (status) {
        this.params = {
          requireCode: '',
          borrowName: '',
          borrowMobile: '',
          applyCityId: '',
          applyStatus: '',
          isDirect: null,
          applyCityName: ''
        }
       this.time = {}
      }
      this.currentPage = 1
      this.getTableData()
    },
    selectCity (obj) {
      this.params.applyCityName = obj.label
    },
    opera (obj) {
      let isReadOnly = true
      let requireCode = obj.requireCode
      let fundType = obj.fundType
      window.open(`/harbour/static/#/demands/detailOrEdit?isReadOnly=${isReadOnly}&requireCode=${requireCode}&fundType=${fundType}`, '_blank')
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
