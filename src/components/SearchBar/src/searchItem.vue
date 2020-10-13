<template>
  <div class="sass-search-item">
    <div v-if="label" class="search-label">{{label}}</div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.sass-search-item::v-deep{
  margin-right:10px;
  display: flex;
  .search-label{
    padding-right: 10px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color:#333;
  }
  .sass-input{
    width: 160px;
  }
}
</style>
