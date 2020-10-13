<template>
  <div class="loan-apply-list">
    <section>
      <search-bar>
        <search-item>
          <s-input
            v-model="params.productName"
            placeholder="产品名称"
          />
        </search-item>
        <search-item>
          <s-input
            v-model="params.name"
            placeholder="资金方名称"
          />
        </search-item>
        <search-item>
          <s-select
            :options="cityMap"
            v-model="params.cityId"
            placeholder="城市"
          />
        </search-item>
        <search-item>
          <s-select
            :options="statusMap"
            v-model="params.status"
            placeholder="状态"
          />
        </search-item>
        <search-item>
          <s-button @click="search(false)">查询</s-button>
        </search-item>
        <search-item>
          <s-button @click="search(true)" type="default">清空</s-button>
        </search-item>
        <search-item>
          <s-button @click="opera(0, 'add')">新增产品分配</s-button>
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
    <Modal
            :hasok="true"
            :hascancel="true"
            :value="isShowModal"
            :title="modelTitle"
            @ok="modalOk"
            :disabled="ModalDisabled"
            @update:value="modalCancel"
    >
      <Content
              :options="modelOptions"
              v-model="modelValue"
              @elChange="modelValueChange"
              :disabled="ModalDisabled"
      ></Content>
    </Modal>
    <Toast ref="toast"></Toast>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
import BS from '@/common/bs'
import Utils from '@/common/utils'
import FundingApi from '@/common/api/funding'
import Select from '@/components/Select'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import Toast from '@/components/Toast'
import { SearchBar, SearchItem } from '@/components/SearchBar/index'
import { Modal, Content } from '@/components/Modal'

export default {
  template: 'borrow-list',
  components: {
    SSelect: Select,
    SInput: Input,
    SButton: Button,
    STable: Table,
    SPagination: Pagination,
    SearchBar,
    SearchItem,
    Toast,
    Modal,
    Content
  },
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
          title: '产品名称',
          render: (h, obj) => {
            return h('div', {}, obj.productName)
          }
        },
        {
          title: '资金方名称',
          render: (h, obj) => {
            return h('div', {}, obj.name)
          }
        },
        {
          title: '城市',
          render: (h, obj) => {
            return h('div', {}, obj.cityName)
          }
        },
        {
          title: '平台服务费率（%）',
          render: (h, obj) => {
            return h('div', {}, obj.platformRate/100000)
          }
        },
        {
          title: '佣金费率（%）',
          render: (h, obj) => {
            return h('div', {}, obj.rebateRate/100000)
          }
        },
        {
          title: '优先级',
          render: (h, obj) => {
            return h('div', {}, obj.priority)
          }
        },
        {
          title: '最新操作时间',
          render: (h, obj) => {
            return h('div', {}, Utils.fmtTime(obj.updateTime, 'yyyy/MM/dd hh:mm:ss'))
          }
        },
        {
          title: '最新操作人',
          render: (h, obj) => {
            return h('div', {}, obj.opUser)
          }
        },
        {
          title: '状态',
          render: (h, obj) => {
            const statusObj = this.statusMap.find( item => item.value === obj.status)
            return h('div', {}, statusObj?statusObj.label:"")
          }
        },
        {
          title: '操作',
          render: (h, obj) => {
            return h('div', {}, [
              h('a', {
                attrs: {
                  href: "javascript:;",
                  style: `${obj.status?"cursor:pointer;":"cursor:no-drop;"}margin-right: 5px;`
                },
                on: {
                  click: () => {
                    this.opera(obj, 'detail')
                  }
                }
              }, '详情'),
              h('a', {
                attrs: {
                  href: "javascript:;",
                  style: obj.status?"cursor:pointer;":"cursor:no-drop;"
                },
                on: {
                  click: () => {
                    if (obj.status) { // 已停用的资金方不允许对其操作新添加产品，以及新分配产品
                      this.opera(obj , 'edit')
                    }
                  }
                }
              }, '修改')
            ])
          }
        }
      ],
      source: [],
      checkList: ['选中且禁用','复选框 A'],
      checked: true,
      currentPage: 1, // 当前页码
      limit: 10, // 每页显示条数
      totalCount: 0, // 总页数
      ModalDisabled: false,
      params: {
        productName: '',
        name: '',
        cityId: '',
        status: ''
      },
      loading: true,
      modelTitle: "产品分配",
      isShowModal: false,
      modelOptions: [
        {
          key: 'cityId', // name yexuyeao
          label: '城市',
          type: 'select',
          disabled: false
        },
        {
          key: 'fundSourceId', // name yegei
          label: '资金方',
          type: 'select',
          disabled: false
        },
        {
          key: 'fundProductId', // name 也需要穿
          label: '产品名称',
          type: 'select',
          disabled: false
        },
        {
          key: 'platformRate',
          label: '平台服务费率(%)：',
          type: 'input',
          disabled: false
        },
        {
          key: 'rebateRate',
          label: '佣金费率(%)：',
          type: 'input',
          disabled: false
        },
        {
          key: 'periods',
          label: '期限',
          type: 'checkboxGroup',
          options: [],
          disabled: false
        },
        {
          key: "repayMode",
          label: "还款方式",
          type: 'checkboxGroup',
          options: [],
          disabled: false
        },
        {
          key: 'priority',
          label: '优先级',
          type: 'input',
          disabled: false
        },
        {
          key: 'status',
          label: '启用状态',
          type: 'radioGroup',
          options: [
            {
              value: 1,
              label: '启用'
            },
            {
              value: 0,
              label: '停用'
            }
          ],
          disabled: false
        }
      ],
      modelValue: {
        cityId: '',
        name: '',
        fundSourceId: '',
        productName: '',
        fundProductId: '',
        platformRate: '',
        rebateRate: '',
        periods: [],
        repayMode: [],
        priority: '',
        status: 1,
      },
      statusMap: [
        {value: 0, label: '停用'},
        {value: 1, label: '启用'}
      ],
      cityMap: []
    }
  },
  mounted () {
    this.init()
    this.getTableData()
  },
  // computed: {
  //   ...mapState(['cityMap'])
  // },
  methods: {
    async init () {
      this.cityMap = await FundingApi.getCityName();
      this.modelOptions[0].options = this.cityMap;
      this.modelOptions[1].options = await FundingApi.getFundName();
      const codeAll = await BS.getCode();
      this.modelOptions[5].options = Utils.formatBSCodes(codeAll.saas_fund_support_terms)
      this.modelOptions[6].options = Utils.formatBSCodes(codeAll.saas_fund_repay_mode)
    },
    getProducts (fundSourceId) {
      FundingApi.getProducts({ fundSourceId }).then((data) => {
        this.$set(this.modelOptions[2], 'options', data)
        // this.modelOptions[2].options = data;
      }).finally(() => {
      })
    },
    modelValueChange (vmKey, obj) {
      if (vmKey === "fundSourceId") { // 资金方选项变动
        this.modelValue.name = obj.label
        this.getProducts(obj.value);
      }
      if (vmKey === "fundProductId") { // 产品变动
        this.modelValue.productName = obj.label
      }
      if (vmKey === "cityId") { // 城市变动
        this.modelValue.cityName = obj.label
      }
    },
    modalCancel () {
      this.hideModal()
    },
    showModal () {
      this.isShowModal = true
    },
    hideModal () {
      this.isShowModal = false
    },
    modalOk () {
      const { periods = '', repayMode = '' , platformRate = 0, rebateRate = 0 } = this.modelValue;

      const params = Object.assign({}, this.modelValue, {
        periods: periods.toString(),
        repayMode: repayMode.toString(),
        platformRate: platformRate*100000,
        rebateRate: rebateRate*100000
      })
      this.loading = true
      FundingApi.feeDetailEdit(params).then(() => {
        this.hideModal()
        this.getTableData()
      }).finally(() => {
        this.loading = false
      })
    },
    getTableData () {
      let params = {
        ...this.params,
        pageSize: this.limit,
        index: this.currentPage
      }
      this.loading = true
      FundingApi.feeDetailList(params).then((data) => {
        this.totalCount = data.total || 0
        this.source = data.list
      }).finally(() => {
        this.loading = false
      })
    },
    search (status) {
      if (status) {
        this.params.productName = '';
        this.params.name = '';
        this.params.cityId = '';
        this.params.status = '';
      }
      this.currentPage = 1
      this.getTableData()
    },
    opera (item = void 0, type) {
      if (type === "detail") { // 详情
        this.modelTitle = '产品详情'
        this.ModalDisabled = true;
      }
      if (type === "edit") {
        this.modelTitle = '修改产品'
        this.ModalDisabled = false;
        this.modelOptions[0].disabled = true
        this.modelOptions[1].disabled = true
        this.modelOptions[2].disabled = true
        this.modelOptions[3].disabled = true
        this.modelOptions[4].disabled = true
        this.modelOptions[5].disabled = true
        this.modelOptions[6].disabled = true
      }
      if (type === "add") {
        this.modelTitle = '新增产品'
        this.ModalDisabled = false;
        this.modelOptions[0].disabled = false
        this.modelOptions[1].disabled = false
        this.modelOptions[2].disabled = false
        this.modelOptions[3].disabled = false
        this.modelOptions[4].disabled = false
        this.modelOptions[5].disabled = false
        this.modelOptions[6].disabled = false
      }
      if (!item) {
        this.modelValue = {
          cityName: '',
          cityId: '',
          name: '',
          fundSourceId: '',
          productName: '',
          fundProductId: '',
          platformRate: '',
          rebateRate: '',
          periods: [],
          repayMode: [],
          priority: '',
          status: 1,
        }
      } else {
        if (item.fundSourceId) this.getProducts(item.fundSourceId);
        this.modelValue = {
          cityName: item.cityName,
          cityId: item.cityId,
          name: item.name,
          fundSourceId: item.fundSourceId,
          productName: item.productName,
          fundProductId: item.fundProductId,
          platformRate: item.platformRate/100000,
          rebateRate: item.rebateRate/100000,
          periods: item.periods.split(','),
          repayMode: item.repayMode.split(','),
          priority: item.priority,
          status: item.status,
          id: item.id,
        }
      }
      this.showModal()
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
