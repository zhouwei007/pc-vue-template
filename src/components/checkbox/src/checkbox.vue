<template>
  <label
    class="el-checkbox"
    :class="[
      border && checkboxSize ? 'el-checkbox--' + checkboxSize : '',
      { 'is-disabled': isDisabled },
      { 'is-bordered': border },
      { 'is-checked': isChecked }
    ]"
    role="checkbox"
    :aria-checked="indeterminate ? 'mixed': isChecked"
    :aria-disabled="isDisabled"
    :id="id"
  >
    <span class="el-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
       aria-checked="mixed"
    >
      <span class="el-checkbox__inner"></span>
      <input
        v-if="trueLabel || falseLabel"
        class="el-checkbox__original"
        type="checkbox"
        aria-hidden="true"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
      <input
        v-else
        class="el-checkbox__original"
        type="checkbox"
        aria-hidden="true"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
    </span>
    <span class="el-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<style scoped>
  .el-checkbox, .el-checkbox__input {
    display: inline-block;
    position: relative
  }

  .el-checkbox-button__inner, .el-checkbox__input {
    white-space: nowrap;
    vertical-align: middle;
    outline: 0
  }

  .el-checkbox {
    color: #606266;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-right: 30px
  }

  .el-checkbox.is-bordered {
    padding: 9px 20px 9px 10px;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: normal;
    height: 40px
  }

  .el-checkbox.is-bordered.is-checked {
    border-color: #409EFF
  }

  .el-checkbox.is-bordered.is-disabled {
    border-color: #EBEEF5;
    cursor: not-allowed
  }

  .el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin-left: 10px
  }

  .el-checkbox.is-bordered.el-checkbox--medium {
    padding: 7px 20px 7px 10px;
    border-radius: 4px;
    height: 36px
  }

  .el-checkbox.is-bordered.el-checkbox--medium .el-checkbox__label {
    line-height: 17px;
    font-size: 14px
  }

  .el-checkbox.is-bordered.el-checkbox--medium .el-checkbox__inner {
    height: 14px;
    width: 14px
  }

  .el-checkbox.is-bordered.el-checkbox--small {
    padding: 5px 15px 5px 10px;
    border-radius: 3px;
    height: 32px
  }

  .el-checkbox.is-bordered.el-checkbox--small .el-checkbox__label {
    line-height: 15px;
    font-size: 12px
  }

  .el-checkbox.is-bordered.el-checkbox--small .el-checkbox__inner {
    height: 12px;
    width: 12px
  }

  .el-checkbox.is-bordered.el-checkbox--small .el-checkbox__inner::after {
    height: 6px;
    width: 2px
  }

  .el-checkbox.is-bordered.el-checkbox--mini {
    padding: 3px 15px 3px 10px;
    border-radius: 3px;
    height: 28px
  }

  .el-checkbox.is-bordered.el-checkbox--mini .el-checkbox__label {
    line-height: 12px;
    font-size: 12px
  }

  .el-checkbox.is-bordered.el-checkbox--mini .el-checkbox__inner {
    height: 12px;
    width: 12px
  }

  .el-checkbox.is-bordered.el-checkbox--mini .el-checkbox__inner::after {
    height: 6px;
    width: 2px
  }

  .el-checkbox__input {
    cursor: pointer;
    line-height: 1
  }

  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #edf2fc;
    border-color: #DCDFE6;
    cursor: not-allowed
  }

  .el-checkbox__input.is-disabled .el-checkbox__inner::after {
    cursor: not-allowed;
    border-color: #C0C4CC
  }

  .el-checkbox__input.is-disabled .el-checkbox__inner + .el-checkbox__label {
    cursor: not-allowed
  }

  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #F2F6FC;
    border-color: #DCDFE6
  }

  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #C0C4CC
  }

  .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner {
    background-color: #F2F6FC;
    border-color: #DCDFE6
  }

  .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner::before {
    background-color: #C0C4CC;
    border-color: #C0C4CC
  }

  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #409EFF;
    border-color: #409EFF
  }

  .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #C0C4CC;
    cursor: not-allowed
  }

  .el-checkbox__input.is-checked .el-checkbox__inner::after {
    -webkit-transform: rotate(45deg) scaleY(1);
    transform: rotate(45deg) scaleY(1)
  }

  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #409EFF
  }

  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #409EFF
  }

  .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
    content: '';
    position: absolute;
    display: block;
    background-color: #FFF;
    height: 2px;
    -webkit-transform: scale(.5);
    transform: scale(.5);
    left: 0;
    right: 0;
    top: 5px
  }

  .el-checkbox__input.is-indeterminate .el-checkbox__inner::after {
    display: none
  }

  .el-checkbox__inner {
    display: inline-block;
    position: relative;
    border: 1px solid #DCDFE6;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #FFF;
    z-index: 1;
    -webkit-transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46);
    transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46)
  }

  .el-checkbox__inner:hover {
    border-color: #409EFF
  }

  .el-checkbox__inner::after {
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    content: "";
    border: 1px solid #FFF;
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 4px;
    position: absolute;
    top: 1px;
    -webkit-transform: rotate(45deg) scaleY(0);
    transform: rotate(45deg) scaleY(0);
    width: 3px;
    -webkit-transition: -webkit-transform .15s ease-in .05s;
    transition: -webkit-transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
    -webkit-transform-origin: center;
    transform-origin: center
  }

  .el-checkbox__original {
    opacity: 0;
    outline: 0;
    position: absolute;
    margin: 0;
    width: 0;
    height: 0;
    z-index: -1
  }

  .el-checkbox-button, .el-checkbox-button__inner {
    display: inline-block;
    position: relative
  }

  .el-checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: 14px
  }

  .el-checkbox:last-child {
    margin-right: 0
  }

  .el-checkbox-button__inner {
    line-height: 1;
    font-weight: 500;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    border-left: 0;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    -webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
    transition: all .3s cubic-bezier(.645, .045, .355, 1);
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 0
  }

  .el-checkbox-button__inner.is-round {
    padding: 12px 20px
  }

  .el-checkbox-button__inner:hover {
    color: #409EFF
  }

  .el-checkbox-button__inner [class*=el-icon-] {
    line-height: .9
  }

  .el-checkbox-button__inner [class*=el-icon-] + span {
    margin-left: 5px
  }

  .el-checkbox-button__original {
    opacity: 0;
    outline: 0;
    position: absolute;
    margin: 0;
    z-index: -1
  }

  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    -webkit-box-shadow: -1px 0 0 0 #8cc5ff;
    box-shadow: -1px 0 0 0 #8cc5ff
  }

  .el-checkbox-button.is-checked:first-child .el-checkbox-button__inner {
    border-left-color: #409EFF
  }

  .el-checkbox-button.is-disabled .el-checkbox-button__inner {
    color: #C0C4CC;
    cursor: not-allowed;
    background-image: none;
    background-color: #FFF;
    border-color: #EBEEF5;
    -webkit-box-shadow: none;
    box-shadow: none
  }

  .el-checkbox-button.is-disabled:first-child .el-checkbox-button__inner {
    border-left-color: #EBEEF5
  }

  .el-checkbox-button:first-child .el-checkbox-button__inner {
    border-left: 1px solid #DCDFE6;
    border-radius: 4px 0 0 4px;
    -webkit-box-shadow: none !important;
    box-shadow: none !important
  }

  .el-checkbox-button.is-focus .el-checkbox-button__inner {
    border-color: #409EFF
  }

  .el-checkbox-button:last-child .el-checkbox-button__inner {
    border-radius: 0 4px 4px 0
  }

  .el-checkbox-button--medium .el-checkbox-button__inner {
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 0
  }

  .el-checkbox-button--medium .el-checkbox-button__inner.is-round {
    padding: 10px 20px
  }

  .el-checkbox-button--small .el-checkbox-button__inner {
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 0
  }

  .el-checkbox-button--small .el-checkbox-button__inner.is-round {
    padding: 9px 15px
  }

  .el-checkbox-button--mini .el-checkbox-button__inner {
    padding: 7px 15px;
    font-size: 12px;
    border-radius: 0
  }

  .el-checkbox-button--mini .el-checkbox-button__inner.is-round {
    padding: 7px 15px
  }

  .el-checkbox-group {
    font-size: 0
  }
</style>
<script>

export default {
  name: 'ElCheckbox',
  componentName: 'ElCheckbox',
  data() {
    return {
      selfModel: false,
      focus: false,
      isLimitExceeded: false
    };
  },

  computed: {
    model: {
      get() {
        return this.isGroup
          ? this.store : this.value !== undefined
            ? this.value : this.selfModel;
      },

      set(val) {
        if (this.isGroup) {
          this.isLimitExceeded = false;
          (this._checkboxGroup.min !== undefined && val.length < this._checkboxGroup.min && (this.isLimitExceeded = true));

          (this._checkboxGroup.max !== undefined && val.length > this._checkboxGroup.max && (this.isLimitExceeded = true));
          this.isLimitExceeded === false && this._checkboxGroup.$emit('update:value', val)
        } else {
          this.$emit('input', val);
          this.selfModel = val;
        }
      }
    },
    isChecked() {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        return this.model;
      } else if (Array.isArray(this.model)) {
        return this.model.indexOf(this.label) > -1;
      } else if (this.model !== null && this.model !== undefined) {
        return this.model === this.trueLabel;
      }
      else {
        return this.model
      }
    },
    isGroup() {
      return  this.getIsGroup();
    },

    store() {
      return this._checkboxGroup ? this._checkboxGroup.value : this.value;
    },

    /* used to make the isDisabled judgment under max/min props */
    isLimitDisabled() {
      const { max, min } = this._checkboxGroup;
      return !!(max || min) && (this.model.length >= max && !this.isChecked) || (this.model.length <= min && this.isChecked);
    },

    isDisabled() {
      return this.isGroup ? this._checkboxGroup.disabled || this.disabled || this.isLimitDisabled : this.disabled;
    },

    checkboxSize() {
      const temCheckboxSize = this.size;
      return this.isGroup ? this._checkboxGroup.checkboxGroupSize || temCheckboxSize : temCheckboxSize;
    }
  },

  props: {
    value: {},
    label: {}, // 选中状态的值（只有在checkbox-group或者绑定对象类型为array时有效）
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number],
    id: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/
    controls: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/
    border: Boolean,
    size: String
  },

  methods: {
    getIsGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'ElCheckboxGroup') {
          parent = parent.$parent;
        } else {
          this._checkboxGroup = parent;
          return true;
        }
      }
      return false;
    },
    addToStore() {
      if (
        Array.isArray(this.model) &&
        this.model.indexOf(this.label) === -1
      ) {
        this.model.push(this.label);
      } else {
        this.model = true;
      }
    },
    handleChange(ev) {
      if (this.isLimitExceeded) return;
      let value;
      if (ev.target.checked) {
        value = this.trueLabel === undefined ? true : this.trueLabel;
      } else {
        value = this.falseLabel === undefined ? false : this.falseLabel;
      }
      this.$emit('change', value, ev);
    }
  },

  created() {
    this.checked && this.addToStore();
  },
  mounted() { // 为indeterminate元素 添加aria-controls 属性
    if (this.indeterminate) {
      this.$el.setAttribute('aria-controls', this.controls);
    }
  },

  watch: {
    value(value) {
      this.$emit('change', value)
    }
  }
};
</script>
