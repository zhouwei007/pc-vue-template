<template>
  <div
   class="sass-option"
   :class="{'disabled': disabled}"
   @click="clickOption(value, label, disabled)"
  >
    <template v-if="icon">
      <i :class="{'hl-icon': true, [icon]: true}"></i>{{label}}
    </template>
    <template v-else>
      {{label}}
    </template>
  </div>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    label: String,
    value: [String, Number],
    icon: String
  },
  methods: {
    clickOption (value, label, disabled) {
      if (disabled) return
      this.$emit('select', { value, label })
    }
  }
}
</script>

<style lang="scss" scoped>
.sass-option{
  display: flex;
  height: 30px;
  line-height: 30px;
  // width: 100%;
  font-size: 14px;
  padding-left: 10px;
  cursor: pointer;
  &.disabled{
    color: #999999;
    &:hover{
      background: none;
      color:#999;
      cursor: default;
    }
  }
  &:hover {
    background: $primary-color;
    color: #ffffff;
  }
  .hl-icon {
    padding-right: 5px;
  }
}
</style>
