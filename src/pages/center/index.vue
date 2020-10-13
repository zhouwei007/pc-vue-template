<template>
  <div class="main">
    <div class="content">
      <div class="title">账号信息</div>
      <s-form>
        <form-item label="账号">
          {{params.userName}}
        </form-item>
      </s-form>
      <s-form>
        <form-item label="密码">
          <s-input
            v-model="params.password"
            type="password"
            :valiRule="vali.password"
            placeholder="6-20位字母、数字或符号，区分大小写"
          />
        </form-item>
      </s-form>
      <s-form>
        <form-item label="确认密码" >
          <s-input
            v-model="params.surePassword"
            type="password"
            :valiRule="vali.password"
            placeholder="6-20位字母、数字或符号，区分大小写"
          />
        </form-item>
      </s-form>
      <s-form>
        <form-item label="姓名" required>
          <s-input
            v-model="params.displayName"
            :valiRule="vali.name"
            placeholder="4-20位字母或汉字，区分大小写"
          />
        </form-item>
      </s-form>
      <s-form>
        <form-item label="手机号码" required>
          <s-input
            v-model="params.phone"
            :valiRule="vali.phone"
            placeholder="请输入有效手机号码便于接收短信提醒"
          />
        </form-item>
      </s-form>
      <s-form>
        <form-item label="邮箱" required>
          <s-input
            v-model="params.email"
            :valiRule="vali.email"
            placeholder="请输入有效邮箱便于接收邮件提醒"
          />
        </form-item>
      </s-form>
      <!-- <s-form>
        <form-item label="所属角色">
          {{params.roleName}}
        </form-item>
      </s-form> -->
      <div class="btn-box">
        <s-button @click="save" size="normal">保存</s-button>
        <s-button @click="goback" size="normal">返回</s-button>
      </div>
      <Toast ref="toast"></Toast>
    </div>
  </div>
</template>

<script>
import Input from '@/components/Input'
import Button from '@/components/Button'
import Toast from '@/components/Toast'
import { Form, FormItem } from '@/components/Form/index'
import RoleApi from '@/common/api/role'
import { mapState } from 'vuex'
export default {
  template: 'center',
  data () {
    return {
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
      params: {
        userName: '',
        roleName: '',
        password: '',
        surePassword: '',
        displayName: '',
        phone: '',
        email: '',
        id: ''
      }
    }
  },
  components: {
    SInput: Input,
    SButton: Button,
    SForm: Form,
    FormItem,
    Toast
  },
  computed: {
    ...mapState(['loginInfo'])
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    checkParams (params) {
      let { password, name, phone, email } = this.vali
      let res = {}
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
      // if (!params.password) {
      //     res.msg = '请填写密码'
      //     res.status = false
      //     return res
      // }
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
    save () {
      let res = this.checkParams(this.params)
      if (!res.status) {
        this.$refs.toast.show(res.msg)
        return
      }
      RoleApi.userEdit(this.params).then(() => {
        this.$refs.toast.show('修改成功')
      }, (err) => {
        this.$refs.toast.show(err)
      } )
    },
    goback () {
      this.$router.go(-1)
    },
    async getInfo () {
      let data = await RoleApi.ownerInfo({ userName: this.loginInfo.username })
      this.params = data
      this.params.password = ''
    },
  }
}
</script>

<style lang="scss" scoped>
  .main {
    min-height: 730px;
    background: #ffffff;
    padding: 15px 30px;
    .content{
      width: 400px; 
      margin: 0 auto;
    }
    .title{
      padding-bottom: 20px;
      font-weight: bold;
    }
  }
  .sass-form-item::v-deep{
    .sass-input{
      width: 300px;
    }
  }
  .btn-box{
    width: 100%;
    display: flex;
    justify-content : center;
    .sass-button:first-child{
      margin-right: 20px;
    }
  }
</style>
