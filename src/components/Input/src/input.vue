<template>
  <div :class="{'sass-input': true, 'focus': isFocus, 'readonly': isReadOnly, 'error': errorMsg.length > 0}">
    <div class="sass-input-inner">
      <textarea
        v-if="type==='textarea'"
        :value="text"
        :placeholder="isReadOnly ? '' :placeholder"
        :disabled="isReadOnly"
        @input="onChange"
        @focus="onFocus"
        @blur="onBlur"
      />
      <input
       v-else
      :value="text"
      :type="type"
      :placeholder="isReadOnly ? '' :placeholder"
      :disabled="isReadOnly"
      @input="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />
    <span v-if="required && !label" class="required">必填</span>
    <div v-if="errorMsg.length>0" class="error">{{errorMsg}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Input',
  data () {
    return {
      isFocus: false,
      text: this.value,
      errorMsg: this.errorMessage
    }
  },
  inject: {
    seniorAction: {
      default: null
    }
  },
  props: {
    value: [String, Number],
    describeObj: { // 高级交互对象
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      default: 'text',
      validator (val) {
        return [
          'text',
          'textarea',
          'password'
        ].includes(val)
      }
    },
    attrKey: {
      type: String,
      default: ''
    },
    allowClear: Boolean,
    placeholder: {
      type: [String, Number],
      default: '请填写'
    },
    disabled: {
      type: [String, Boolean],
      default: false
    },
    required: {
      type: [Boolean, Number],
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    valiRule: {
      type: [String, RegExp, Object, Function],
      default: ''
    }
  },
  computed: {
    isReadOnly: function () {
      return this.disabled === true || this.disabled === 'disabled' || this.disabled === 'true'
    }
  },
  watch: {
    errorMessage: function (value) {
      this.errorMsg = value
    },
    value: function (val) {
      if ([undefined, ''].includes(val)) {
        this.text = ''
      } else {
        this.text = val
      }
      this.text = val
    }
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  methods: {
    onFocus () {
      this.isFocus = true
      this.errorMsg = ''
      this.$emit('focus')
      this.describeObj.focus && this.seniorAction(this.describeObj.focus)
    },
    onBlur (e) {
      this.isFocus = false
      this.validate()
      this.$emit('blur', e)
      this.describeObj.blur && this.seniorAction(this.describeObj.blur)
    },
    onChange (e) {
      let val = e.target.value
      this.text = val
      this.$emit('update:value', val)
      this.$emit('change', e, this.attrKey)
      this.describeObj.change && this.seniorAction(this.describeObj.change)
    },
    validate () {
      this.errorMsg = ''
      if (this.required && !this.text) {
        this.errorMsg = `${this.label}不能为空`
        return false
      }
      if (typeof this.valiRule === 'function') { // 如果校验的是函数
        if (!this.valiRule(this.text)) {
          this.errorMsg = `${this.label}有误，请重新输入`
          return false
        }
        return true
      }
      let reg = new RegExp(this.valiRule)
      if (this.text && !reg.test(this.text)) {
        this.errorMsg = `${this.label}有误，请重新输入`
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.sass-input{
  // width: 100%;
  width: 160px;
  min-height: 30px;
  line-height: 30px;
  border-radius: $component-border-radius;
  border: $border;
  &.focus{
    border: $border-focus;
  }
  input,textarea{
    padding: 0 20px 0 10px;
    // width: 100%;
    // height: 100%;
    width: calc(100% - 30px);
    height: 28px;
  }
  input::-webkit-input-placeholder,textarea::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: $text-color-secondary;
    font-size: 14px;
  }
  input:-moz-placeholder,textarea:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: $text-color-secondary;
    font-size: 14px;
  }
  input::-moz-placeholder,textarea::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: $text-color-secondary;
    font-size: 14px;
  }
  input:-ms-input-placeholder,textarea:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: $text-color-secondary;
    font-size: 14px;
  }
  &.readonly {
    background: #FAFAFA;
    input,textarea {
      background: #FAFAFA;
    }
  }
  &.error {
    border: 1px solid #F6622C;
  }
  .sass-input-inner{
    position: relative;
    .required{
      position: absolute;
      right:10px;
      font-size: 12px;
      color:#F6622C;
    }
    .error {
      min-height: 24px;
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
}
</style>
