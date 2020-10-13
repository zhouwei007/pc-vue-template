<template>
  <div :class="{'sass-select': true, 'readonly': isReadOnly, 'error': errorMsg.length > 0}">
    <div
      class="select-inner"
      @click="toggle()"
      @mouseover="setClearShow"
      @mouseout="setClearHide"
    >
      <div class="select-input">
        <span v-if="isShowHolder" class="placeholder">{{placeholder}}</span>
        <i v-if="isIcon" :class="{'hl-icon': true, [icon]: true}"></i>
        <span v-else>{{currentText}}</span>
      </div>
      <div class="select-icons">
        <div class="arrow hl-icon hl-icon-arrow-down" />
        <div v-if="isClear" :style="{'display': isClearShow ? 'block' : 'none' }" class="close hl-icon hl-icon-round-close-fill" @click="clear" />
      </div>
    </div>
    <div class="select-dropdown" v-show="isShow">
      <Option
        v-for="(option, index) in finalOptions"
        :key="option.value + index"
        :label="option.label"
        :value="option.value"
        :icon="option.icon"
        :disabled="option.disabled || false"
        @select="select"
      />
    </div>
    <div v-if="errorMsg.length>0" class="error">{{errorMsg}}</div>
  </div>
</template>

<script>
import Option from './option'
export default {
  name: 'Select',
  inject: {
    seniorAction: {
      default: null
    }
  },
  data () {
    return {
      selected: '',
      currentText: '',
      filterText: '',
      isShowHolder: true,
      isShow: false,
      isClearShow: false,
      errorMsg: ''
    }
  },
  computed: {
    finalOptions() { // 格式化下拉选项数据
     let newOptions = []
        if (this.options && this.options.length > 0) {
          for (let j = 0; j < this.options.length; j++) {
            let list = {}
            !(this.options[j].label) ? (list.label = this.options[j].name) : (list.label =  this.options[j].label)
            !(this.options[j].value !== undefined) ? (list.value = this.options[j].code) : (list.value =  this.options[j].value)
            list.limit = this.options[j].limit
            if (this.options[j].icon) {
              list.icon = this.options[j].icon
            }
            if(!this.options[j].limit){
              newOptions.push(list)
            }
          }
        }
      return newOptions
    }
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    describeObj: { // 高级交互对象
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: [String, Number],
      default: ''
    },
    attrKey: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    defaultValue: [String, Number],
    options: {
      type: Array,
      default () {
        return []
      }
    },
    isReadOnly: {
      type: Boolean,
      default: false
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
    isIcon: {
      type: Boolean,
      default: false
    }
  },
  components: { Option },
  watch: {
    currentText (val) {
      this.isShowHolder = [undefined, '', null].includes(val)
    },
    options () {
      this.initCurrentText()
    },
    errorMessage: function (value) {
      this.errorMsg = value
    },
    value: function (val) {
      if ([undefined, ''].includes(val)) {
        this.currentText = ''
      }
    },
    defaultValue() { // 监控中途值变化 初始化值
      this.initCurrentText()
    }
  },
  mounted () {
    this.initCurrentText()
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) this.isShow = false
    })
  },
  methods: {
    toggle () {
      if (this.isReadOnly) {
        return
      }
      this.isShow = true
      this.errorMsg = ''
    },
    select (opt) {
      if (!opt || opt.value === undefined) {
        return
      }
      this.currentText = opt.label
      this.selected = opt
      this.isShow = false
      this.$emit('update:value', opt.value)
      this.$emit('change', opt, this.attrKey)
      this.describeObj.change && this.seniorAction(this.describeObj.change)
    },
    setClearHide () {
      this.isClearShow = false
    },
    setClearShow () {
      if ([undefined, ''].includes(this.currentText)) {
        this.isClearShow = false
        return
      }
      this.isClearShow = true
    },
    showDropdown () {
      this.isShow = true
      this.errorMsg = ''
    },
    initCurrentText () {
      if (this.defaultValue || this.value) {
        let result = this.defaultValue ? this.defaultValue : this.value
        let finalOption = this.finalOptions.find((option) => {
          return option.value === result
        })
        if (finalOption) {
          this.currentText = finalOption.label
          this.selected = finalOption
        }
      }
    },
    clear (e) {
      e.cancelBubble = true
      this.currentText = ''
      this.isShow = false
      this.$emit('update:value', '')
      this.$emit('change', {})
      this.describeObj.change && this.seniorAction(this.describeObj.change)
    },
    validate () {
      this.errorMsg = ''
      if (this.required && !this.selected.value) {
        this.errorMsg = `${this.label}不能为空`
        return false
      }
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
.sass-select{
  width: 158px;
  height: 30px;
  line-height: 30px;
  border-radius: $component-border-radius;
  border: 1px solid #E2E6ED;
  text-indent: 10px;
  font-size: 14px;
  position: relative;
  .select-inner{
    display: flex;
    cursor: pointer;
  }
  .select-input{
    width: calc(100% - 29px);
  }
  &.error {
    border: 1px solid #F6622C;
  }
  .select-icons{
    width: 29px;
    position: relative;
    .arrow,.close{
      width: 29px;
      height: 28px;
      position: absolute;
      background: #fff;
    }
  }
  .arrow{
    font-size: 12px;
  }
  .close{
    font-size: 18px;
    color:#bfbfbf;
    display: none;
    text-indent: 6px;
    &:hover{
      color:#8c8c8c;
    }
  }
  .placeholder{
    color: #999999;
  }
  .select-dropdown{
    position: absolute;
    width: 100%;
    background: #fff;
    border-radius: $component-border-radius;
    border: $border;
    box-shadow: $box-shadow;
    max-height: $option-height * 8;
    overflow-y: auto;
    z-index: 11;
  }
  .hl-icon-triangle-up {
    color: #666780;
  }
  &.readonly {
    background: #FAFAFA;
    .arrow {
      background: #FAFAFA;
    }
    .select-inner{
      cursor: default;
    }
  }
  .error {
      height: 24px;
      line-height: 24px;
      position: absolute;
      top: 28px;
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
