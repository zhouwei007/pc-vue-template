<template>
  <section class="main-box">
    <div class="left"></div>
    <div class="right">
        <div class="title">中后台管理</div>
        <div class="formstyle">
            <input type="text" class="userCode" v-model="userCode" placeholder="输入账号" @keyup="keyUp()">
            <div class="clear-userName" v-show="isClearUserNameShow" @click="clear('userCode')"><i class="hl-icon hl-icon-round-close-fill"></i></div>
            <input :type="isEyesOpen ? 'text' : 'password' " class="password" v-model="password" placeholder="输入登录密码" @keyup="keyUp()">
            <div class="clear-password" v-show="isClearPasswordShow" @click="clear('password')"><i class="hl-icon hl-icon-round-close-fill"></i></div>
            <div v-show="isEyesShow" class="eyes" @click="passwordSwitch()">
                <i v-if="isEyesOpen" class="hl-icon hl-icon-eye"></i>
                <i v-else class="hl-icon hl-icon-eye-close"></i>
            </div>
            <div class="loginBtn" @click='toLogin()'>登录</div>
        </div>
    </div>
    <Toast ref="toast"></Toast>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Toast from '@/components/Toast'
export default {
  data () {
    return {
      password: '',
      userCode: '',
      isClearUserNameShow: false,
      isClearPasswordShow: false,
      isEyesShow: false,
      isEyesOpen: false
    }
  },
  components: {
    Toast
  },
  computed: {
    ...mapState(['loginInfo'])
  },
  methods: {
    // 判断清除及眼睛按钮是否出现
    keyUp () {
      this.isClearUserNameShow = this.userCode.length > 0
      this.isClearPasswordShow = this.password.length > 0
      this.isEyesShow = this.password.length > 0
    },
    // 清除
    clear (field) {
      this[field] = ''
      if (field === 'userCode') {
        this.isClearUserNameShow = false
      }
      if (field === 'password') {
        this.isClearPasswordShow = false
        this.isEyesShow = false
      }
    },
    // 密码明文密文转换
    passwordSwitch () {
      this.isEyesOpen = !this.isEyesOpen
    },
    // 用户名密码校验
    validate () {
      return true
    },
    // 登录
    toLogin () {
      if (this.validate()) {
        let userInfo = {
          username: this.userCode,
          password: this.password
        }
        this.login(userInfo).then(() => {
          this.$router.push('/')
        }, (err) => {
          this.$refs.toast.show(err)
        })
      }
    },
    // 初始化，如果token已经存在则直接跳转到主页
    init () {
      if (this.loginInfo.token) {
        this.$router.push('/')
      }
    },
    ...mapActions([
      'login'
    ])
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
a{
  cursor:pointer;
}
input{
  background:none;
  outline:none;
  border:none;
  box-shadow: none;
}
.main-box {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2B2C3B;
  .left {
    width: 800px;
    height: 600px;
    background-image: url("../../assets/images/bg.png");
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  .right {
    background: #ffffff;
    width: 400px;
    height: 600px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    .title {
      font-size: 36px;
      color: #23243C;
      margin: 90px auto 0 auto;
      text-align: center;
      font-weight: bold;
    }
  }
}
.userCode {
    padding: 0;
    border: none;
    box-shadow: none;
    border-radius: 0;
    width: 300px;
    height: 59px;
    border-bottom: 1px solid #DDDDDD;
    margin: 60px 50px 20px 50px;
    font-size: 18px;
    color: #333333;
    line-height: 60px;
}
.userCode:focus {
    box-shadow: none;
    border: none;
    border-bottom: 1px solid #2957F9;
}
.password {
    padding: 0;
    border: none;
    box-shadow: none;
    border-radius: 0;
    width: 300px;
    height: 59px;
    border-bottom: 1px solid #DDDDDD;
    margin: 0px 50px 20px 50px;
    font-size: 18px;
    color: #333333;
}
.password:focus {
    box-shadow: none;
    border: none;
    border-bottom: 1px solid #5360B7;
}
.loginBtn {
    width: 300px;
    background: #5360B7;
    border-radius: 2px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 18px;
    color: #FFFFFF;
    margin: 40px 50px 0 50px;
    cursor: pointer;
}
.logoutBtn {
    font-size: 14px;
    color: #333333;
    display: block;
    text-align: center;
    margin: 20px auto 0 auto;
    text-decoration: underline;
    cursor: pointer;
}
.formstyle {
    position: relative;
}
.clear-userName {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 80px;
    right: 50px;
    cursor: pointer;
}
.clear-password {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 160px;
    right: 50px;
    cursor: pointer;
}
.eyes {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 160px;
    right: 80px;
}
.findPassword {
  text-align: center;
  margin-top: 20px;
  text-decoration: underline;
  cursor: pointer;
}
.hl-icon-round-close-fill {
    font-size: 20px;
    color: #DDDDDD;
    cursor: pointer;
}
.hl-icon-eye {
    font-size: 20px;
    color: #5360B7;
    cursor: pointer;
}
.hl-icon-eye-close {
    // display: none;
    font-size: 20px;
    color: #5360B7;
    cursor: pointer;
}
</style>
