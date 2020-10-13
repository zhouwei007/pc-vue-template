<template>
  <div class="sass-radio-group" :class="classname">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'RadioGroup',
  model: {
    prop: 'value',
    event: 'update:value'
  },
  inject: {
    seniorAction: {
      default: null
    }
  },
  watch: {
    value(newValue) {
      this.$emit('change', newValue, this.attrKey)
      this.describeObj.change && this.seniorAction(this.describeObj.change)
    }
  },
  props: {
    describeObj: { // 高级交互对象
      type: Object,
      default: () => {
        return {}
      }
    },
    attrKey: {
      type: String,
      default: ''
    },
    value: {
      type: [Number, String],
      default: null
    },
    classname: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.sass-radio {
  display: inline-block;
  .sass-radio-input {
    float: left;
    position: relative;
    display: block;
    width: 14px;
    height: 14px;
    line-height: 14px;
    text-indent: -3px;
    .hl-icon {
      font-size: 20px;
      color: #E2E6ED;
      &.hl-icon-round {
        color: #E2E6ED;
      }
      &.hl-icon-round-dot{
       color: #6975C9
      }
    }
    .sass-radio-inner {
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      width: 14px;
      height: 14px;
      margin: 0;
      opacity: 0;
      cursor: pointer;
    }
  }

  .sass-radio-label {
    font-size: 14px;
    line-height: 14px;
    color: #333;
    float: left;
    span {
      color: #333;
      cursor: pointer;
    }
  }
  &.sass-radio-disabled {
    .hl-icon {
      color: #eee;
    }
    .sass-radio-inner {
      cursor: not-allowed;
    }
  }
}
</style>
