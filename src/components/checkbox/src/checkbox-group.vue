<script>

  export default {
    name: 'ElCheckboxGroup',
    componentName: 'ElCheckboxGroup',
    props: {
      value: {
        type: Array,
        default: () => {
          return []
        }
      },
      disabled: Boolean,
      size: String,
      fill: String,
      textColor: String,
      attrKey: {  // $ref 用于区分控件
        type: String,
        default: ''
      }
    },

    computed: {
      checkboxGroupSize() {
        return this.size ;
      }
    },
    model: {
      prop: 'value',
      event: 'update:value'
    },
    watch: {
      value(value) {
       this.$emit('change', value, this.attrKey)
      }
    }
  };
</script>

<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>
