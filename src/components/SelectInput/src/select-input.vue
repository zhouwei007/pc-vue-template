<template>
  <div class="select-input">
    <Select
      class="element margin"
      :options="options"
      v-model="opt.key"
      :defaultValue="opt.key"
    ></Select>
    <Input
      class="element"
      v-model="opt.value"
      :disabled="disabled"
      :required="required"
      :label="label"
      :valiRule="valiRule"
    />
  </div>
</template>

<script>
import Input from '@/components/Input'
import Select from '@/components/Select'
export default {
  name: 'RangeInput',
  components: {
    Input,
    Select
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    opt: {
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
    },
    options: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scope>
.select-input {
  display: flex;
  margin-bottom: 5px;
  .element {
    min-width: 140px;
  }
  .margin {
    margin-right: 5px;
  }
}
</style>