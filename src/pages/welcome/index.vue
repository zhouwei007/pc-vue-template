<template>
  <div class="welcome">
    <div class="text">{{loginInfo.username}}，您好，欢迎使用中后台管理系统</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['loginInfo'])
  },
}
</script>

<style lang="scss" scoped>
.welcome {
  display: flex;
  align-items: center;
  justify-items: center;
  padding-top: 200px;
  .text {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #171d2b;
    letter-spacing: 0;
    text-align: center;
    margin: 0 auto;
  }
}
</style>