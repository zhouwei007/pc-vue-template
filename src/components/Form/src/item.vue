<template>
  <div class="sass-form-item">
    <div v-if="label" class="form-label">{{label}}<span v-if="required" class="required">*</span></div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FromItem',
  props: {
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.sass-form-item::v-deep{
  display: flex;
  width: 100%;
  .form-label{
    padding-right: 10px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color:#333;
    min-width: 80px;
  }
  .required{
    color:red;
    padding:0 5px;
  }
  .sass-input{
    width: 100%;
  }
}
</style>
