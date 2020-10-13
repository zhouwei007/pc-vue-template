<template>
<div :class="{'datapicker-single': true, 'error': errorMsg.length > 0}">
  <Datepicker
    :format="format"
    class="datapicker"
    v-model="text"
    placeholder="选择日期"
    :disabled="isReadOnly"
    @selected="selected"
    @opened="opened"
    @closed="closed"
  />
  <div v-if="errorMsg.length>0" class="error">{{errorMsg}}</div>
</div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import Utils from '@/common/utils'
export default {
  name: 'datapicker',
  data () {
    return {
      text: this.value,
      errorMsg: this.errorMessage
    }
  },
  components: {
    Datepicker
  },
  inject: {
    seniorAction: {
      default: null
    }
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    value: [String, Number, Date],
    isReadOnly: {
      type: Boolean,
      default: false
    },
    describeObj: { // 高级交互对象
      type: Object,
      default: () => {
        return {}
      }
    },
    errorMessage: {
      type: String,
      default: ''
    },
    required: {
      type: [Boolean, Number],
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    }
  },
  methods: {
    validate () {
      this.errorMsg = ''
      if (this.required && !this.value) {
        this.errorMsg = `${this.label}不能为空`
        return false
      }
      return true
    },
    selected (date) {
      this.errorMsg = ''
      this.$emit('selected')
      this.$emit('update:value',Utils.dateFormat(date))
      this.describeObj.change && this.seniorAction(this.describeObj.change)
    },
    opened () {},
    closed () {}
  }
}
</script>

<style lang="scss" scope>
.datapicker-single {
  position: relative;
  &.error {
    .datapicker{
      input {
        border: 1px solid #F6622C;
      }
    }
  }
  .datapicker{
    input {
      width: 160px;
      min-height: 30px;
      line-height: 30px;
      border-radius: $component-border-radius;
      border: $border;
      padding: 0 20px 0 10px;
      width: 100%;
      font-size: 14px;
      &.focus{
        border: $border-focus;
      }
      &:disabled {
        background: #FAFAFA;
      }
    }
  }
  .error {
    height: 24px;
    line-height: 24px;
    position: absolute;
    top: 30px;
    left: -1px;
    background: #FFF1EB;
    border: 1px solid #F6622C;
    border-radius: 2px;
    font-size: 12px;
    color: #F7622C;
    z-index: 12;
    padding: 0 7px;
    &:before {
      content: '';
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-bottom-color: #F6622C;
      position: absolute;
      left: 50%;
      top: 0;
      margin-top: -12px;
      margin-left: -3px;
    }
    &:after {
      content: "";
      width: 0;
      height: 0;
      border: 4px solid transparent;
      border-bottom-color: #FFF1EB;
      position: absolute;
      left: 50%;
      top: 0;
      margin-top: -8px;
      margin-left: -1px;
    }
  }
}
</style>
