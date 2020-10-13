<template>
  <div class="loan-apply-list">
    <section>
      <search-bar>
        <search-item>
          <s-input
            v-model="params.roleName"
            placeholder="角色名称"
          />
        </search-item>
        <search-item>
          <s-input
            v-model="params.roleCode"
            placeholder="角色编码"
          />
        </search-item>
        <search-item>
          <s-select
            :options='statusMap'
            v-model="params.available"
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
          <s-button @click="addCity" type="default">添加角色</s-button>
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
        <form-item label="角色名称" required>
          <s-input
            v-model="roleName"
            placeholder="角色名称"
          />
        </form-item>
      </s-form>
      <s-form>
        <form-item label="角色编码" required>
          <s-input
            :disabled="isEdit"
            v-model="roleCode"
            placeholder="角色编码"
          />
        </form-item>
      </s-form>
      <s-form>
        <form-item label="启用状态">
          <RadioGroup
            v-model="available"
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

import RoleApi from '@/common/api/role'
import Select from '@/components/Select'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import Toast from '@/components/Toast'
import { SearchBar, SearchItem } from '@/components/SearchBar/index'
import { Form, FormItem } from '@/components/Form/index'
import Modal from '@/components/Modal'
import { Radio, RadioGroup } from '@/components/RadioGroup'
export default {
  template: 'role-list',
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
          title: '角色名称',
          render: (h, obj) => {
            return h('div', {}, obj.roleName)
          }
        },
        {
          title: '角色编码',
          render: (h, obj) => {
            return h('div', {}, obj.roleCode)
          }
        },
        {
          title: '状态',
          render: (h, obj) => {
            return h('div', {}, obj.available === 1 ? '启用' : '停用')
          }
        },
        {
          title: '操作',
          render: (h, obj) => {
            return h('div', { class: 'opera' },
              [
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
        roleName: '',
        roleCode: '',
        available: ''
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
      isShow: false,
      roleName: '',
      roleCode: '',
      available: 1,
      id: null,
      modalTitle: '添加角色',
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
  },
  methods: {
    getTableData () {
      let params = {
        ...this.params,
        pageSize: this.limit,
        pageNo: this.currentPage - 1
      }
      this.loading = true
      RoleApi.roleList(params).then((data) => {
        this.totalCount = data.total || 0
        this.source = data.list
      }).finally(() => {
        this.loading = false
      })
    },
    search (status) {
      if (status) {
        this.time = {}
        this.params = {
          roleName: '',
          roleCode: '',
          available: ''
        }
      }
      this.currentPage = 1
      this.getTableData()
    },
    edit (obj) {
      this.roleName = obj.roleName
      this.roleCode = obj.roleCode
      this.available = obj.available
      this.id = obj.id
      this.modalTitle = '修改角色'
      this.isShow = true
      this.errorMessage = ''
      this.isEdit = true
    },
    addCity () {
      this.errorMessage = ''
      this.modalTitle = '添加角色'
      this.roleName = ''
      this.roleCode = ''
      this.available = 1
      this.id = null
      this.isEdit = false
      this.isShow = true
    },
    addOk () {
      let params = {
        roleName: this.roleName,
        roleCode: this.roleCode,
        available: this.available
      }
      if (!params.roleName || !params.roleCode) {
        this.errorMessage = '请填写角色名称及角色编码'
        return
      }
      if (this.id) {
        params.id = this.id
        RoleApi.roleEdit(params).then(() => {
          this.isShow = false
          this.errorMessage = ''
          this.getTableData()
        }, (err) => {
          this.errorMessage = err
        } )
      } else {
        RoleApi.roleAdd(params).then(() => {
          this.isShow = false
          this.errorMessage = ''
          this.getTableData()
        }, (err) => {
          this.errorMessage = err
        } )
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
  .error{
    color:red;
    font-size: 12px;
  }
</style>
