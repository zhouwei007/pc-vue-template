<template>
  <button
    class="sass-button"
    :class="[`${type} ${size}`, {
      'disabled': disabled,
    }]"
    @click="click"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'primary',
      validator (val) {
        return [
          'default',
          'primary',
          'bottom'
        ].includes(val)
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small',
      validator (val) {
        return [
          'small',
          'normal',
          'big'
        ].includes(val)
      }
    }
  },
  methods: {
    click (event) {
      this.disabled
        ? this.$emit('error', event)
        : this.$emit('click', event)
    }
  }
}
</script>

<style lang="scss" scoped>
.sass-button {
  display: inline-block;
  padding: 0;
  font-size: 12px;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  outline-style: none;
  user-select: none;
  cursor: pointer;
  display: block;
  font-size: 12px;
  &.disabled {
    cursor: not-allowed;
  }
  &.small{
    width: 80px;
    height: 30px;
    line-height: 30px;
  }
  &.normal{
    width: 140px;
    height: 40px;
    line-height: 40px;
  }
  &.big{
    width: 300px;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
  }
  &.default{
    color: $themeColor;
    background-color: #fff;
    border:1px $themeColor solid;
  }
  &.primary {
    color: #fff;
    background-color: $themeColor;
    border-radius: $component-border-radius;
  }
  &.primary:active {
    background-color: $themeActiveColor;
  }

  &.primary.disabled {
    background-color: $themeDisableColor;
    transform: none;
  }
}
</style>
