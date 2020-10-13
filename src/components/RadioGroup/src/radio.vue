<template>
  <div
    class="sass-radio"
    :class="{
      'checked': isGroup ? value === model : model,
      'sass-radio-disabled': isDisabled
    }"
  >
    <div class="sass-radio-input" @click.stop="trigger" :style="{ marginRight: label ? '10px' : '0'}">
      <i
        class="hl-icon"
        :class="(isGroup ? value === model : model) ? 'hl-icon-round-dot' : 'hl-icon-round'"
      />
      <input
        :value="model"
        type="radio"
        class="sass-radio-inner"
      >
    </div>
    <div
      v-if="$slots.default || label"
      class="sass-radio-label"
      @click.stop="trigger"
    >
      <slot>{{ label }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Radio',
  props: {
    value: {
      type: [Boolean, Number, String]
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    propValue: {
      type: [Boolean, String, Number]
    }
  },
  model: {
    prop: 'propValue',
    event: 'update:value'
  },
  computed: {
    isGroup() {
      return this.$parent.$options._componentTag === 'RadioGroup'
    },
    isDisabled() {
      return this.$parent.disabled || this.disabled
    },
    model: {
      get() {
        return this.isGroup ? this.$parent.value : this.propValue
      },
      set(newValue) {
        this.isGroup ? this.$parent.$emit('update:value', newValue) : this.$emit('update:value', !this.propValue)
      }
    }
  },
  methods: {
    trigger () {
      if (this.disabled || this.$parent.disabled) {
        return
      }
      this.model = this.value
    }
}
}
</script>

<style lang="scss" scoped>
.sass-radio {
  display: inline-block;
  margin-right:20px;
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
    cursor: pointer;
    span {
      color: #333;
      cursor: pointer;
    }
  }
  &.sass-radio-disabled {
    .hl-icon {
      color: #eee;
      &.hl-icon-round-dot{
       color: #eee;
      }
    }
    .sass-radio-inner {
      cursor: not-allowed;
    }
  }
}
</style>
