<template>
  <div class="header">
    <div class="logo">中后台管理</div>
    <div class="operator">
      <span @click="change"><span>{{loginInfo.username}}</span></span>
      <span @click="toLogout"><span>安全退出</span></span>
    </div>
    <Toast ref="toast"></Toast>
  </div>
</template>
<script>
import Toast from '@/components/Toast'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
    }
  },
  components: {
    Toast
  },
  created () {
  },
  computed: {
    ...mapState(['loginInfo'])
  },
  methods: {
    toLogout () {
      this.logout().then(() => {
        this.$router.push('/login')
      }, (err) => {
        this.$refs.toast.show(err)
        this.$router.push('/login')
      })
    },
    change () {
      this.$router.push('/center/index')
    },
    ...mapActions([
      'logout'
    ])
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.header {
  display:flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  background-color:#2B2C3B;
  height: 60px;
  font-size: 20px;
  color: #fff;
  position: fixed;
  width: calc(100% - 60px);
  z-index: 15;
  .operator{
    font-size: 12px;
    line-height: 1;
    .anticon{
      margin-right: 4px;
      font-size: 14px;
    }
    &>span{
      cursor: pointer;
      &>*{
        vertical-align: middle;
      }
      &:nth-child(n + 2){
        margin-left: 20px;
      }
    }

  }
}
</style>
