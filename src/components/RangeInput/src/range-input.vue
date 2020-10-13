<template>
  <div class="range-input">
    <Input
      class="element"
      v-if="type === 'text'"
      v-model="value.start"
      :disabled="disabled"
      :required="required"
      :label="label"
      :valiRule="valiRule"
    />
    <span>~</span>
    <Input
      class="element"
      v-if="type === 'text'"
      v-model="value.end"
      :disabled="disabled"
      :required="required"
      :label="label"
      :valiRule="valiRule"
    />
  </div>
</template>

<script>
import Input from '@/components/Input'
export default {
  name: 'RangeInput',
  components: {
    Input
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    value: {
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
      type: [String, RegExp, Object],
      default: ''
    }
  }
}
</script>

<style lang="scss" scope>
  .range-input {
    display: flex;
    >span {
      padding: 0 10px;
      line-height: 30px;
    }
  }
</style>