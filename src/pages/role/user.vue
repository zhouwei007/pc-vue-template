<template>
  <div class="loan-apply-list">
    <section>
      <search-bar>
        <search-item>
          <s-input
            v-model="params.userName"
            placeholder="用户名称"
          />
        </search-item>
        <!-- <search-item>
          <s-select
            :options='roleMap'
            v-model="params.roleCode"
            placeholder="角色"
          />
        </search-item> -->
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
          <s-button @click="addCity" type="default">添加用户</s-button>
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
        <form-item label="账号" required>
          <s-input
            :disabled="isEdit"
            v-model="userName"
            :valiRule="vali.user"
            placeholder="4-20位字母或数字，区分大小写"
          />
        </form-item>
      </s-form>
      <s-form>
        <form-item label="密码" :required="!isEdit">
          <s-input
            v-model="password"
            type="password"
            :valiRule="vali.password"
            placeholder="6-20位字母、数字或符号，区分大小写"
          />
        </form-item>
      </s-form>
      <s-form>
        <form-item label="确认密码" :required="!isEdit">
          <s-input
            v-model="surePassword"
            type="password"
            :valiRule="vali.password"
            placeholder="6-20位字母、数字或符号，区分大小写"
          />
        </form-item>
      </s-form>
      <s-form>
        <form-item label="姓名" required>
          <s-input
            v-model="displayName"
            :valiRule="vali.name"
            placeholder="4-20位字母或汉字，区分大小写"
          />
        </form-item>
      </s-form>
      <s-form>
        <form-item label="手机号码" required>
          <s-input
            v-model="phone"
            :valiRule="vali.phone"
            placeholder="请输入有效手机号码便于接收短信提醒"
          />
        </form-item>
      </s-form>
      <s-form>
        <form-item label="邮箱" required>
          <s-input
            v-model="email"
            :valiRule="vali.email"
            placeholder="请输入有效邮箱便于接收邮件提醒"
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
  template: 'user-list',
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
          title: '账号',
          render: (h, obj) => {
            return h('div', {}, obj.userName)
          }
        },
        {
          title: '姓名',
          render: (h, obj) => {
            return h('div', {}, obj.displayName)
          }
        },
        {
          title: '手机号码',
          render: (h, obj) => {
            return h('div', {}, obj.phone)
          }
        },
        {
          title: '邮箱',
          render: (h, obj) => {
            return h('div', {}, obj.email)
          }
        },
        // {
        //   title: '角色',
        //   render: (h, obj) => {
        //     return h('div', {}, obj.roleName)
        //   }
        // },
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
        userName: '',
        roleCode: '',
        available: ''
      },
      loading: true,
      // roleMap: [
      //   {
      //     label: '天津中后台',
      //     value: 1
      //   },
      //   {
      //     label: '天津中后台',
      //     value: 2
      //   }
      // ],
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
      userName: '',
      password: '',
      displayName: '',
      surePassword: '',
      phone: '',
      email: '',
      available: '',
      id: 0,
      modalTitle: '添加用户',
      errorMessage: '',
      vali: {
        user: /^[A-Za-z0-9]{4,20}$/,
        password: /^[A-Za-z0-9~!@#$%^&*()|,.<>?"'();:_+-={}]{6,20}$/,
        name: function (val) {
          let b = 0;
          let len = val.length;  //初始化字节数递加变量并获取字符串参数的字符个数
          if(len) {  //如果存在字符串，则执行计划
            for(let i = 0; i < len; i ++) {  //遍历字符串，枚举每个字符
              if(val.charCodeAt(i) > 255) {  //字符编码大于255，说明是双字节字符
                b += 2;  //则累加2个
              }else {
                b ++;  //否则递加一次
              }
            }
          }
          if (b>=4 && b<=20){
            return true
          }
          else {
            return false
          }
        },
        phone: /^1\d{10}$/,
        email: /^([a-zA-Z0-9_-])+@(([a-zA-Z0-9_-])+\.)+([a-zA-Z0-9]{2,4})+$/
      },
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
    // this.getRoles()
    this.getTableData()
  },
  methods: {
    checkParams (params) {
      let { user, password, name, phone, email} = this.vali
      let res = {}
      if (!(params.userName && user.test(params.userName))) {
        res.msg = '请输入正确用户名'
        res.status = false
        return res
      }
      if (params.password) {
        if (!(params.password && password.test(params.password))) {
          res.msg = '请输入正确格式密码'
          res.status = false
          return res
        }
        if (!(params.surePassword && params.surePassword === params.password)) {
          res.msg = '密码不一致'
          res.status = false
          return res
        }
      }
      if (!params.password && !this.isEdit) {
          res.msg = '请填写密码'
          res.status = false
          return res
      }
      if (!(params.displayName && name(params.displayName))) {
        res.msg = '请输入正确姓名'
        res.status = false
        return res
      }
      if (!(params.phone && phone.test(params.phone))) {
        res.msg = '请输入正确手机号'
        res.status = false
        return res
      }
      if (!(params.email && email.test(params.email))) {
        res.msg = '请输入正确邮箱'
        res.status = false
        return res
      }
      res.msg = ''
      res.status = true
      return res
    },
    // getRoles () {
    //   RoleApi.roleList().then((data) => {
    //     this.roleMap = []
    //     let list = data.list || []
    //     list.map((item) => {
    //       this.roleMap.push({
    //         label: item.roleName,
    //         value: item.roleCode
    //       })
    //     })
    //   })
    // },
    getTableData () {
      let params = {
        ...this.params,
        pageSize: this.limit,
        pageNo: this.currentPage - 1
      }
      this.loading = true
      RoleApi.userList(params).then((data) => {
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
          userName: '',
          roleCode: '',
          available: ''
        }
      }
      this.currentPage = 1
      this.getTableData()
    },
    edit (obj) {
      this.userName = obj.userName
      this.password = obj.password
      this.displayName = obj.displayName
      this.phone = obj.phone
      this.email = obj.email
      this.available = obj.available
      this.id = obj.id
      this.surePassword = obj.surePassword
      this.modalTitle = '修改用户'
      this.isShow = true
      this.isEdit = true
      this.errorMessage = ''
    },
    addCity () {
      this.errorMessage = ''
      this.modalTitle = '添加用户'
      this.userName = ''
      this.password = ''
      this.surePassword = ''
      this.displayName = ''
      this.phone = ''
      this.email = ''
      this.available = 1
      this.id = null
      this.isShow = true
      this.isEdit = false
    },
    addOk () {
      let params = {
        userName : this.userName,
        password: this.password,
        surePassword: this.surePassword,
        displayName: this.displayName,
        phone: this.phone,
        email: this.email,
        available: this.available
      }
      let res = this.checkParams(params)
      if (!res.status) {
        this.errorMessage = res.msg
        return
      }
      if (this.id) {
        params.id = this.id
        RoleApi.userEdit(params).then(() => {
          this.isShow = false
          this.getTableData()
        }, (err) => {
          this.errorMessage = err
        } )
      } else {
        RoleApi.userAdd(params).then(() => {
          this.isShow = false
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
  .role-box{
    width: calc(100% - 40px);
    border: 1px #eee solid;
    padding:20px 20px 10px 20px;
    .sass-radio{
      display: block;
      margin-bottom: 10px;
      height: 15px;
    }
  }
</style>
