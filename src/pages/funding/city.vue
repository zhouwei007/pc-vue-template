<template>
  <div class="loan-apply-list">
    <section>
      <search-bar>
        <search-item>
          <s-input
            v-model="params.cityName"
            placeholder="城市名称"
          />
        </search-item>
        <search-item>
          <s-input
            v-model="params.cityCode"
            placeholder="城市编码"
          />
        </search-item>
        <search-item>
          <s-select
            :options='statusMap'
            v-model="params.cityStatus"
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
          <s-button @click="addCity" type="default">添加城市</s-button>
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
    <s-modal :title="modalTitle" v-model="isShow" @ok="addOk" :hascancel="true">
      <s-form>
        <form-item label="选择省">
          <s-select
            :isReadOnly="isEdit"
            :options='provinceMap'
            :defaultValue="provinceCode"
            @change="selectProvince"
            :isClear="false"
            placeholder="选择省"
          />
        </form-item>
      </s-form>
      <s-form>
        <form-item label="选择市">
          <s-select
            :isReadOnly="isEdit"
            :options='cityMap'
            v-model="cityCode"
            :defaultValue="cityCode"
            :isClear="false"
            placeholder="选择市"
          />
        </form-item>
      </s-form>
      <s-form>
        <form-item label="启用状态">
          <RadioGroup
            v-model="cityStatus"
          >
        <Radio :value="1" >启用</Radio>
        <Radio :value="0" >停用</Radio>
      </RadioGroup>
        </form-item>
      </s-form>
      <div class="error">{{errorMessage}}</div>
    </s-modal>
    <Toast ref="toast"></Toast>
  </div>
</template>

<script>
import FundingApi from '@/common/api/funding'
import Select from '@/components/Select'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import Toast from '@/components/Toast'
import { SearchBar, SearchItem } from '@/components/SearchBar/index'
import Confirm from '@/components/Confirm'
import { Form, FormItem } from '@/components/Form/index'
import Modal from '@/components/Modal'
import { Radio, RadioGroup } from '@/components/RadioGroup'
export default {
  template: 'city-list',
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
          title: '城市名称',
          render: (h, obj) => {
            return h('div', {}, obj.cityName)
          }
        },
        {
          title: '城市编码',
          render: (h, obj) => {
            return h('div', {}, obj.cityCode)
          }
        },
        {
          title: '状态',
          render: (h, obj) => {
            return h('div', {}, obj.cityStatus === 1 ? '启动' : '停用')
          }
        },
        {
          title: '操作',
          render: (h, obj) => {
            return h('div', { class: 'opera' },
              [
                // h('a', {
                //   on: {
                //     click: () => {
                //       this.opera(obj)
                //     }
                //   }
                // }, '删除')
                h('a', {
                  on: {
                    click: () => {
                      this.edit(obj)
                    }
                  }
                }, '编辑')
              ])
          }
        }
      ],
      source: [],
      currentPage: 1, // 当前页码
      limit: 10, // 每页显示条数
      totalCount: 0, // 总页数
      params: {
        cityName: '',
        cityCode: '',
        cityStatus: ''
      },
      loading: true,
      statusMap: [
        {
          label: '启用',
          value: 1
        },
        {
          label: '停用',
          value: 0
        }
      ],
      provinceMap: [],
      cityMap: [],
      isShow: false,
      provinceCode: '',
      cityCode: '',
      cityStatus: 1,
      id: 0,
      modalTitle: '添加城市',
      errorMessage: '',
      isEdit: false
    }
  },
  components: {
    SSelect: Select,
    SInput: Input,
    SButton: Button,
    STable: Table,
    SPagination: Pagination,
    SModal: Modal,
    SForm: Form,
    FormItem,
    SearchBar,
    SearchItem,
    Radio,
    RadioGroup,
    Toast
  },
  mounted () {
    this.getTableData()
    this.getProvince()
  },
  methods: {
    getProvince () {
      FundingApi.getProvince().then((data) => {
        this.provinceMap = data
      })
    },
    getCity (obj) {
      FundingApi.getCity({ provinceCode: obj.value }).then((data) => {
        this.cityMap = data
      })
    },
    selectProvince (obj) {
      this.provinceCode = obj.value
      this.cityCode = ''
      this.errorMessage = ''
      this.getCity(obj)
    },
    selectCity (obj) {
      this.cityCode = obj.value
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
      FundingApi.cityList(params).then((data) => {
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
          cityName: '',
          cityCode: '',
          cityStatus: ''
        }
      }
      this.currentPage = 1
      this.getTableData()
    },
    opera (obj) {
      Confirm.show({
        title: '提示',
        message: '确认要删除城市吗?',
        handleSubmit: this.ok.bind(this, obj)
      })
    },
    ok (obj) {
      FundingApi.cityDel(obj).then(() => {
        this.$refs.toast.show('删除成功')
      })
    },
    edit (obj) {
      this.provinceCode = obj.provinceCode
      this.cityCode = obj.cityCode
      this.cityStatus = obj.cityStatus
      this.id = obj.id
      this.modalTitle = '编辑城市'
      this.isShow = true
      this.errorMessage = ''
      this.isEdit = true
      this.getCity({ value: obj.provinceCode })
    },
    addCity () {
      this.errorMessage = ''
      this.modalTitle = '添加城市'
      this.provinceCode = ''
      this.cityCode = ''
      this.id = 0
      this.cityStatus = 1
      this.isEdit = false
      this.isShow = true
    },
    addOk () {
      let params = {
        provinceCode: this.provinceCode,
        cityCode: this.cityCode,
        cityStatus: this.cityStatus,
        id: this.id
      }
      FundingApi.cityAdd(params).then(() => {
        this.isShow = false
        this.getTableData()
      }, (err) => {
        this.errorMessage = err
      } )
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
  .error{
    color:red;
    font-size: 12px;
  }
</style>
