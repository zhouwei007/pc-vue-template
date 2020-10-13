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
            :options="productTypeOptions"
            v-model="params.productType"
            placeholder="产品类型"
          />
        </search-item>
        <search-item>
          <s-select
            :options="wkStatus"
            v-model="params.wkShow"
            placeholder="维客展示"
          />
        </search-item>
      </search-bar>
      <search-bar>
        <search-item>
          <s-select
            :options="statusMap"
            v-model="params.productStatus"
            placeholder="状态"
          />
        </search-item>
        <search-item>
          <s-select
            :options='cityMap'
            v-model="params.cityId"
            placeholder="城市"
          />
        </search-item>
        <search-item>
          <s-button @click="search(false)">查询</s-button>
        </search-item>
        <search-item>
          <s-button @click="search(true)" type="default">清空</s-button>
        </search-item>
        <search-item>
          <s-button @click="opera(0, 'add')">新增产品</s-button>
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
// import { mapState, mapActions } from 'vuex'
import FundingApi from '@/common/api/funding'
import Select from '@/components/Select'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import Toast from '@/components/Toast'
import { SearchBar, SearchItem } from '@/components/SearchBar/index'
import Utils from '@/common/utils'
import BS from '@/common/bs'
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
    Toast
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
          title: '产品编码',
          render: (h, obj) => {
             // TODO 产品编码是啥？
            return h('div', {}, obj.id)
          }
        },
        {
          title: '资金方名称',
          render: (h, obj) => {
            return h('div', {}, obj.name)
          }
        },
        {
          title: '渠道',
          render: (h, obj) => {
            const channel = this.ChannelName.find( item => item.value === obj.fundChannel)
            return h('div', {}, channel ? channel.label : '')
          }
        },
        {
          title: '分配城市',
          render: (h, obj) => {
            let cities = ''
            obj.cityList.map((city) => {
              cities = cities + city.cityName + ' '
            })
            return h('div', {
              attrs: {
                title: cities
                // style: `cursor: pointer;`
              }
            }, obj.cityList.length > 1 ? `${obj.cityList[0].cityName}...` : (obj.cityList[0] ? obj.cityList[0].cityName : ''))
          }
        },
        {
          title: '排序',
          render: (h, obj) => {
            return h('div', {}, obj.sort)
          }
        },
        {
          title: '产品类型',
          render: (h, obj) => {
            return h('div', {}, obj.productTypeName)
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
            const statusObj = this.statusMap.find( item => item.value === obj.productStatus)
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
                  // style: `${obj.status?"cursor:pointer;":"cursor:no-drop;"}margin-right: 5px;`
                  style: `margin-right: 5px;`
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
                  // style: obj.status?"cursor:pointer;":"cursor:no-drop;"
                },
                on: {
                  click: () => {
                    // if (obj.status) { // 已停用的资金方不允许对其操作新添加产品，以及新分配产品
                      this.opera(obj , 'edit')
                    // }
                  }
                }
              }, '修改')
            ])
          }
        }
      ],
      source: [],
      ModalDisabled: false,
      currentPage: 1, // 当前页码
      limit: 10, // 每页显示条数
      totalCount: 0, // 总页数
      params: {
        name: "",
        productName: '',
        productStatus: '',
        cityId: '',
        wkShow: '',
        productType: ''
      },
      loading: true,
      statusMap: [
        {value: 0, label: '停用'},
        {value: 1, label: '启用'}
      ],
      wkStatus: [
        {value: 0, label: '不显示'},
        {value: 1, label: '显示'}
      ],
      cityMap: [],
      FundName: [],
      ChannelName: [],
      productTypeOptions: []
    }
  },
  mounted () {
    this.init()
    this.getTableData()
  },
  computed: {
  },
  methods: {
    async init () {
      this.productTypeOptions = await BS.getOptions('saas_fund_fund_type')
      this.cityMap = await FundingApi.getCityName();
      this.FundName = await FundingApi.getFundName();
      this.ChannelName = await FundingApi.getChannelName();
    },
    getTableData () {
      let params = {
        ...this.params,
        pageSize: this.limit,
        index: this.currentPage
      }
      this.loading = true
      FundingApi.productList(params).then((data) => {
        this.totalCount = data.total
        this.source = data.list
      }).finally(() => {
        this.loading = false
      })
    },
    search (status) {
      if (status) {
        this.params.productName = '';
        this.params.name = '';
        this.params.productStatus = '';
        this.params.cityId = '';
        this.params.wkShow = '';
        this.params.productType = '';
      }
      this.currentPage = 1
      this.getTableData()
    },
    opera (item = void 0, type) {
      if (type === "detail") { // 详情
        window.open(`/harbour/static/#/funding/detail?id=${item.id}&isReadOnly=${true}`, '_blank')
        return
      }
      if (type === "edit") {
        window.open(`/harbour/static/#/funding/detail?id=${item.id}`, '_blank')
        return
      }
      if (type === "add") {
        window.open(`/harbour/static/#/funding/detail`, '_blank')
        return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .loan-apply-list{
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
