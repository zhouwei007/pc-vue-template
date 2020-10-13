<template>
  <div class="sass-modal" v-if="value">
    <div class="sass-mask"></div>
    <div class="sass-wrap">
      <div class="sass-main">
        <div class="modal-title">
          <span class="title">{{title}}</span>
          <i v-if="hasclose" class="close hl-icon hl-icon-close" @click="close"></i>
        </div>
        <div class="modal-content"><slot /></div>
        <div class="modal-footer" v-if="!disabled">
          <s-button size="normal" v-if="hascancel" type="default" @click="cancel">{{canceltxt}}</s-button>
          <s-button size="normal" v-if="hasok" @click="ok">{{oktxt}}</s-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Button from '@/components/Button'
export default {
  name: 'Modal',
  data () {
    return {
    }
  },
  components: {
    SButton: Button
  },
  props: {
    value: [Boolean],
    disabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    hasclose: {
      type: Boolean,
      default: true
    },
    hascancel: {
      type: Boolean,
      default: true
    },
    hasok: {
      type: Boolean,
      default: true
    },
    canceltxt: {
      type: String,
      default: '取消'
    },
    oktxt: {
      type: String,
      default: '确定'
    }
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  methods: {
    close () {
      this.$emit('update:value', false)
    },
    cancel () {
      this.$emit('cancel', false)
      this.$emit('update:value', false)
    },
    ok () {
      this.$emit('ok', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.sass-modal{
  width: 100%;
  .sass-mask{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(55,55,55,.6);
    height: 100%;
    z-index: 1000;
  }
  .sass-wrap{
    position: fixed;
    overflow: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    outline: 0;
  }
  .sass-main{
    width: 600px;
    margin: 0 auto;
    position: relative;
    outline: 0;
    top: 100px;
    background: #fff;
    border:6px;
    .modal-title{
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      color: #333333;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px #F2F2F2 solid;
      .title{
        display: block;
        padding-left:20px;
      }
      .close{
        display: block;
        width: 50px;
        height: 50px;
        color: #D8D8D8;
        text-align: center;
        line-height: 50px;
        font-size: 18px;
        font-weight: bold;
      }
    }
    .modal-footer{
      padding: 15px 20px;
      border-top:1px #F2F2F2 solid;
      display: flex;
      justify-content: flex-end;
      .sass-button:first-child{
        margin-right: 10px;
      }
    }
  }
  .modal-content{
    padding: 20px 40px;
  }
}
</style>
