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
            v-model="params.loanCode"
            placeholder="借款编号"
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
            v-model="params.name"
            placeholder="资金方"
          />
        </search-item>
        <search-item>
          <s-input
            v-model="params.productName"
            placeholder="产品"
          />
        </search-item>
        <!-- <search-item>
          <s-select
            :options="fundMap"
            v-model="params.fundSourceId"
            placeholder="资金方"
          />
        </search-item>
        <search-item>
          <s-select
            :options="productMap"
            v-model="params.fundProductId"
            placeholder="产品"
          />
        </search-item> -->
      </search-bar>
      <search-bar>
        <search-item>
          <s-select
            :options='cityMap'
            v-model="params.cityId"
            placeholder="城市"
          />
        </search-item>
        <search-item>
          <s-select
            :options="platformStatusMap"
            v-model="params.platformConfirmStatus"
            placeholder="服务费状态"
          />
        </search-item>
        <search-item>
          <s-select
            :options="rebateStatusMap"
            v-model="params.rebateConfirmStatus"
            placeholder="返佣状态"
          />
        </search-item>
         <search-item>
          <s-button @click="search(false)">查询</s-button>
        </search-item>
        <search-item>
          <s-button @click="search(true)" type="default">清空</s-button>
        </search-item>
      </search-bar>
      <s-table :columns="columns" :source="source" :isLoading="loading" >
        <template v-slot:opera="{ row }">
          <div class="opera">
            <a href="javascript:;" v-if="row.item.platformConfirmStatus === 0" class="opera" @click="confirm(row.item, '服务费确认', 0)">服务费确认</a>
            <span v-if="row.item.platformConfirmStatus === 0"> | </span>
            <a href="javascript:;" v-if="row.item.rebateConfirmStatus === 0" class="opera" @click="confirm(row.item, '佣金确认', 1)">佣金确认</a>
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
    <s-modal :title="modalTitle" v-model="isShow" @ok="ok" :hascancel="true">
      <ModalContent :data="current" :type="type" />
    </s-modal>
    <Toast ref="toast"></Toast>
  </div>
</template>

<script>
import BS from '@/common/bs'
import { mapState, mapActions } from 'vuex'
import PlatformApi from '@/common/api/platform'
import Select from '@/components/Select'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import Pagination from '@/components/Pagination'
import Toast from '@/components/Toast'
import { SearchBar, SearchItem } from '@/components/SearchBar/index'
import ModalContent from './modalContent'
import Utils from '@/common/utils'
// import Utils from '@/common/utils'
export default {
  template: 'PlatfromList',
  data () {
    return {
      columns: [
        {
          title: '借款编号',
          width: 130,
          render: (h, obj) => {
            return h('div', {}, obj.loanCode)
          }
        },
        {
          title: '需求编号',
          width: 130,
          render: (h, obj) => {
            return h('div', {}, obj.requireCode)
          }
        },
        {
          title: '客户姓名',
          width: 80,
          render: (h, obj) => {
            return h('div', {}, obj.borrowName)
          }
        },
        {
          title: '审批日期',
          width: 130,
          render: (h, obj) => {
            return h('div', {}, Utils.fmtTime(obj.approveTime, 'yyyy-MM-dd'))
          }
        },
        {
          title: '审批金额(万元)',
          width: 80,
          render: (h, obj) => {
            return h('div', {}, obj.approveAmount / 1000000)
          }
        },
        {
          title: '审批期限',
          width: 60,
          render: (h, obj) => {
            return h('div', {}, obj.approvePeriodsStr)
          }
        },
        {
          title: '审批城市',
          width: 60,
          render: (h, obj) => {
            return h('div', {}, obj.cityName)
          }
        },
        {
          title: '平台服务费率(%)',
          width: 100,
          render: (h, obj) => {
            return h('div', {}, obj.platformRate / 1000)
          }
        },
        {
          title: '平台服务费(元)',
          width: 90,
          render: (h, obj) => {
            return h('div', {}, Utils.formatMoney(obj.platformFee))
          }
        },
        {
          title: '佣金费率(%)',
          width: 80,
          render: (h, obj) => {
            return h('div', {}, obj.rebateRate / 1000)
          }
        },
        {
          title: '佣金(元)',
          width: 80,
          render: (h, obj) => {
            return h('div', {}, Utils.formatMoney(obj.rebateFee))
          }
        },
        {
          title: '资金方',
          width: 60,
          render: (h, obj) => {
            return h('div', {}, obj.name)
          }
        },
        {
          title: '产品',
          width: 60,
          render: (h, obj) => {
            return h('div', {}, obj.productName)
          }
        },
        {
          title: '服务费状态',
          width: 60,
          render: (h, obj) => {
            return h('div', {}, obj.platformConfirmStatus === 0 ? '待收' : '已收')
          }
        },
        {
          title: '返佣状态',
          width: 60,
          render: (h, obj) => {
            return h('div', {}, obj.rebateConfirmStatus === 0 ? '待支付' : '已支付')
          }
        },
        {
          title: '操作',
          width: 150,
          slotName: 'opera'
        }
      ],
      source: [],
      currentPage: 1, // 当前页码
      limit: 10, // 每页显示条数
      totalCount: 0, // 总页数
      params: {
        requireCode: '',
        loanCode: '',
        productName: '',
        name: '',
        borrowName: '',
        borrowMobile: '',
        cityId: '',
        platformConfirmStatus: '',
        rebateConfirmStatus: ''
      },
      loading: true,
      demandsStatusMap: [],
      isShow: false,
      type: 0,
      modalTitle: '',
      current: {},
      platformStatusMap: [
        {
          value: 0,
          label: '待收'
        },
        {
          value: 1,
          label: '已收'
        }
      ],
      rebateStatusMap: [
        {
          value: 0,
          label: '待支付'
        },
        {
          value: 1,
          label: '已支付'
        }
      ]
    }
  },
  components: {
    SSelect: Select,
    SInput: Input,
    SButton: Button,
    STable: Table,
    SModal: Modal,
    SPagination: Pagination,
    SearchBar,
    SearchItem,
    Toast,
    ModalContent
  },
  computed: {
    ...mapState(['cityMap', 'fundMap', 'productMap'])
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
      let params = {
        ...this.params,
        page: {
          pageSize: this.limit,
          index: this.currentPage
        }
      }
      this.loading = true
      PlatformApi.getPlatformList(params).then((data) => {
        this.totalCount = data.total
        this.source = data.list
      }).finally(() => {
        this.loading = false
      })
    },
    search (status) {
      if (status) {
        this.params = {
          requireCode: '',
          loanCode: '',
          productName: '',
          name: '',
          borrowName: '',
          borrowMobile: '',
          cityId: '',
          platformConfirmStatus: '',
          rebateConfirmStatus: ''
        }
      }
      this.currentPage = 1
      this.getTableData()
    },
    confirm (obj, title, type) {
      this.current = obj
      this.modalTitle = title
      this.type = type
      this.isShow = true
    },
    ok () {
      let params = {
        id: this.current.id
      }
      let msg = ''
      if (this.type === 0) {
        params.platformConfirmStatus = 1
        msg = '服务费确认成功'
      } else {
        params.rebateConfirmStatus = 1
        msg = '佣金确认成功'
      }
      PlatformApi.setConfirmStatus(params).then(() => {
        this.$refs.toast.show(msg)
        this.isShow = false
        this.getTableData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .loan-apply-list {
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
