<template>
  <div class="loan-apply-list">
    <section>
      <search-bar>
        <search-item>
          <s-input
            v-model="params.channelName"
            placeholder="渠道名称"
          />
        </search-item>
        <search-item>
          <s-select
            :options='statusMap'
            v-model="params.channelStatus"
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
          <s-button @click="addChannel" type="default">添加渠道</s-button>
        </search-item>
      </search-bar>
      <s-table :columns="columns" :source="source" :isLoading="loading" >
        <template v-slot:opera="{ row }">
          <div class="opera">
            <a href="javascript:;" @click="edit(row.item)">编辑</a>
            <!-- <span > | </span>
            <a href="javascript:;" v-if="row.item.channelStatus === 0" @click="channelConfirm({ channelName: row.item.channelName, channelStatus: '1', id: row.item.id})">启用</a>
            <a href="javascript:;" v-else @click="channelConfirm({ channelName: row.item.channelName, channelStatus: '0', id: row.item.id})">停用</a> -->
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
    <s-modal :title="modalTitle" v-model="isShow" @ok="channelConfirm" :hascancel="true">
      <s-form>
        <form-item label="渠道名称" required>
          <s-input
            :disabled="isEdit"
            v-model="channelName"
            placeholder="渠道名称"
          />
        </form-item>
      </s-form>
      <s-form>
        <form-item label="启用状态">
          <RadioGroup
            v-model="channelStatus"
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
  template: 'channel-list',
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
          title: '渠道名称',
          render: (h, obj) => {
            return h('div', {}, obj.channelName)
          }
        },
        {
          title: '状态',
          render: (h, obj) => {
            return h('div', {}, obj.channelStatus === 1 ? '启动' : '停用')
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
      params: {
        channelName: '',
        channelStatus: ''
      },
      id: 0,
      channelName: '',
      channelStatus: 0,
      loading: true,
      modalTitle: '添加渠道',
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
      isShow: false,
      province: '',
      city: '',
      isEdit: false,
      errorMessage: ''
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
  },
  methods: {
    getTableData () {
      let params = {
        ...this.params,
        page: {
          pageSize: this.limit,
          index: this.currentPage
        }
      }
      this.loading = true
      FundingApi.channelList(params).then((data) => {
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
          status: ''
        }
      }
      this.currentPage = 1
      this.getTableData()
    },
    edit (obj) {
      this.isShow = true
      this.id = obj.id
      this.channelName = obj.channelName
      this.channelStatus = obj.channelStatus
      this.modalTitle = '编辑渠道'
      this.isEdit = true
      this.errorMessage = ''
    },
    addChannel () {
      this.isShow = true
      this.id = 0
      this.channelName = ''
      this.channelStatus = 1
      this.modalTitle = '添加渠道'
      this.isEdit = false
      this.errorMessage = ''
    },
    opera (obj) {
      Confirm.show({
        title: '提示',
        message: '确认要删除渠道吗?',
        handleSubmit: this.ok.bind(this, obj)
      })
    },
    ok (obj) {
      FundingApi.channelDel(obj).then(() => {
        this.$refs.toast.show('删除成功')
        this.getTableData()
      })
    },
    channelConfirm (obj) {
      let params = {
        id: obj.id || this.id,
        channelName: obj.channelName || this.channelName,
        channelStatus: Number(obj.channelStatus || this.channelStatus)
      }
      if (!params.channelName) {
        this.errorMessage = '请填写渠道名称'
        return
      }
      FundingApi.channelConfirm(params).then(() => {
        this.isShow = false
        this.getTableData()
      }, (err) => {
        this.errorMessage = err
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
  .error{
    color:red;
    font-size: 12px;
  }
</style>
