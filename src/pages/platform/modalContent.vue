<template>
  <div class="content">
    <div class="content-item">
      <span class="content-lable">城市</span>
      <span class="content-element">{{data.cityName}}</span>
    </div>
    <div class="content-item">
      <span class="content-lable">资金方</span>
      <span class="content-element">{{data.name}}</span>
    </div>
    <div class="content-item">
      <span class="content-lable">产品</span>
      <span class="content-element">{{data.productName}}</span>
    </div>
    <div class="content-item" v-if="type === 0">
      <span class="content-lable">平台服务费率</span>
      <span class="content-element">{{`${data.platformRate / 1000}%`}}</span>
    </div>
    <div class="content-item" v-if="type === 0">
      <span class="content-lable">平台服务费</span>
      <span class="content-element">{{formatMoney(data.platformFee)}}</span>
    </div>
    <div class="content-item" v-if="type === 1">
      <span class="content-lable">佣金费率</span>
      <span class="content-element">{{`${data.rebateRate / 1000}%`}}</span>
    </div>
    <div class="content-item" v-if="type === 1">
      <span class="content-lable">佣金</span>
      <span class="content-element">{{formatMoney(data.rebateFee)}}</span>
    </div>
  </div>
</template>

<script>
import Utils from 'common/utils'
export default {
  name: 'ModalContent',
  props: {
    data: {
      type: [Object],
      default: () => ({})
    },
    type: {
      type: Number,
      default: 0
    }
  },
  methods: {
    formatMoney(money) {
      return Utils.formatMoney(money)
    }
  }
}
</script>

<style lang="scss" scoped>
.content-item {
  display: flex;
  height: 30px;
  margin-bottom: 10px;
  .content-lable {
    width: 146px;
    font-size: 14px;
    color: #333333;
  }
  .content-element {
    width: 270px;
  }
}
</style>
