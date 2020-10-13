<template>
  <div class="loan-apply-list">
    <section>
      <search-bar>
        <search-item>
          <s-input
            v-model="params.name"
            placeholder="资金方名称"
          />
        </search-item>
        <search-item>
          <s-select
            :options="channelStatus"
            v-model="params.channel"
            placeholder="资金方通道"
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
          <s-button @click="search(false)">搜索</s-button>
        </search-item>
        <search-item>
          <s-button @click="search(true)" type="default">清空</s-button>
        </search-item>
        <search-item>
          <s-button @click="opera()">新增资金方</s-button>
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
      @update:value="modalCancel"
    >
      <Content
        @change="contentChange"
        :options="modelOptions"
        v-model="modelValue"
      ></Content>
      <div class="error">{{errorMessage}}</div>
    </Modal>
    <Toast ref="toast"></Toast>
  </div>
</template>

<script>
import BS from '@/common/bs'
import { mapState, mapActions } from 'vuex'
import FundingApi from '@/common/api/funding'
import Utils from '@/common/utils'
import Select from '@/components/Select'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import Toast from '@/components/Toast'
import { SearchBar, SearchItem } from '@/components/SearchBar/index'
import { Modal, Content } from '@/components/Modal'
// import Utils from '@/common/utils'
import UploadApi from '@/common/api/upload'
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
      errorMessage: "",
      columns: [
        {
          title: '序号',
          render: (h, obj, index) => {
            return h('div', {}, index + 1)
          }
        },
        {
          title: '资金方编码',
          render: (h, obj) => {
            return h('div', {}, obj.code)
          }
        },
        {
          title: '资金方名称',
          render: (h, obj) => {
            return h('div', {}, obj.name)
          }
        },
        {
          title: '资金通道',
          render: (h, obj) => {
            return h('div', {}, obj.channelName)
          }
        },
        {
          title: '资金方图标',
          width: '100',
          render: (h, obj) => {
            return h('div', { class: 'icon-box'}, [
              h('img', {
                attrs: {
                  style: `display: ${obj.iconFile ? 'inline-block' : 'none'}`,
                  class: 'icon',
                  src: obj.iconFile
                }
              })
            ])
          }
        },
        {
          title: '显示图标',
          render: (h, obj) => {
            return h('div', {}, obj.iconShow === 0 ? '不显示' : '显示')
          }
        },
        {
          title: '最新操作时间',
          render: (h, obj) => {
            return h('div', {}, Utils.fmtTime(obj.opTime, 'yyyy/MM/dd hh:mm:ss'))
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
            return h('a', {
              attrs: {
                class: 'name',
                href: "javascript:;"
                // style: obj.status?"cursor:pointer;":"cursor:no-drop;"
              },
              on: {
                click: () => {
                  this.opera(obj)
                }
              }
            }, '修改')
          }
        }
      ],
      source: [],
      currentPage: 1, // 当前页码
      limit: 10, // 每页显示条数
      totalCount: 0, // 总页数
      params: {
        name: '',
        channel: '',
        status: ''
      },
      loading: true,
      statusMap: [
        {value: 0, label: '停用'},
        {value: 1, label: '启用'}
      ],
      channelStatus: [],
      isShowModal: false,
      modelTitle: '新增资金方',
      modelOptions: [
        {
          key: 'name',
          label: '资金方',
          type: 'input',
          disabled: false,
          required: true
        },
        {
          key: 'code',
          label: '资金方编码',
          type: 'input',
          disabled: false,
          required: true
        },
        {
          key: 'channel',
          label: '资金通道',
          type: 'select',
          options: [],
          disabled: false,
          required: true,
          isClear: false
        },
        {
          key: 'iconFileId',
          label: '资金方图标',
          type: 'upload',
          hasIcon: true,
          fileUrl: 'iconFile'
        },
        {
          key: 'subbranch',
          label: '下属支行',
          type: 'addItem'
        },
        {
          key: 'iconShow',
          label: '是否显示图标',
          type: 'radioGroup',
          options: [
            {
              value: 1,
              label: '显示'
            },
            {
              value: 0,
              label: '隐藏'
            }
          ],
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
        name: '',
        channel: '',
        priority: '',
        code: '',
        status: 1,
        iconShow: 1,
        iconFileId: null,
        iconFile: '',
        subbranch: []
      }
    }
  },
  mounted () {
    this.init()
    this.getCityByUser()
    this.getTableData()
  },
  computed: {
    ...mapState(['cityMap'])
  },
  methods: {
    ...mapActions({
      getCityByUser: 'getCityByUser'
    }),
    async init () {
      let codeAll = await BS.getCodeAll()
      let statusMap = codeAll.fund_channel
      let temp = []
      statusMap && statusMap.items && Object.keys(statusMap.items).map((item) => {
        // if (Number(statusMap.items[item].codeValue) === 0) return
        temp.push({
          value: statusMap.items[item].codeValue,
          label: statusMap.items[item].codeName
        })
      })
      this.modelOptions[2].options = temp
      this.channelStatus = temp
    },
    contentChange() {
      this.errorMessage = '';
    },
    getTableData () {
      let params = {
        ...this.params,
        pageSize: this.limit,
        index: this.currentPage
      }
      this.loading = true
      FundingApi.fundingList(params).then((data) => {
        this.totalCount = data.total
        let source = data.list || []
        this.setSourceIcon(source)
      }).finally(() => {
        this.loading = false
      })
    },
    async setSourceIcon (source) {
      await Promise.all(source.map(async (item) => {
        if (!item.iconFileId) return
        let data = await this.setIcon(item)
        item.iconFile = data
        return data
      }))
      // source.map(async (item) => {
      //   if (!item.iconFileId) return
      //   let data = await this.setIcon(item)
      //   item.iconFile = data
      // })
      this.source = source
    },
    search (status) {
      if (status) {
        this.params.name ="";
        this.params.status = "";
        this.params.channel = "";
      }
      this.currentPage = 1
      this.getTableData()
    },
    setIcon (row) {
      return UploadApi.getFileUrl(row.iconFileId)
    },
    opera (item = void 0) {
      this.errorMessage = '';
      if (!item) {
        // this.modelOptions[0].disabled = false;
        // this.modelOptions[1].disabled = false;
        this.modelValue = {
          name: '',
          channel: '',
          // priority: '',
          status: 1,
          code: '',
          iconShow: 1,
          iconFileId: null,
          iconFile: '',
          subbranch: []
        }
      } else {
        this.modelTitle = '修改资金方'
        // this.modelOptions[0].disabled = true;
        // this.modelOptions[1].disabled = true
        let arr = [];
        item.subbranch.forEach( item => {
          arr.push({
            name: item.name,
            isEdit: item.isEdit,
            itemStatusBool: item.itemStatusBool,
            original: item.name,
            id: item.id
          })
        })
        this.modelValue = {
          subbranch: arr,
          name: item.name,
          // priority: item.priority,
          channel: item.channel,
          status: item.status,
          code: item.code,
          id: item.id,
          iconShow: item.iconShow,
          iconFileId: item.iconFileId,
          iconFile: item.iconFile
        }
      }
      this.showModal()
    },
    modalOk () {
      let params = {
        ...this.modelValue
      }
      const { name, code, channel} = params;
      if (!name||!code || !channel) {
        return
      }
      this.loading = true
      FundingApi.fundingEdit(params).then(() => {
        this.hideModal()
        this.getTableData()
      }).finally(() => {
        this.loading = false
      }).catch( e=>{
        this.errorMessage = e;
      })
    },
    modalCancel () {
      this.hideModal()
    },
    showModal () {
      this.isShowModal = true
    },
    hideModal () {
      this.isShowModal = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .error{
    color:red;
    font-size: 12px;
  }
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
    .sass-tables::v-deep{
      .icon-box{
        width: 100%;
        text-align: center;
        .icon{
          height: 50px;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
</style>
