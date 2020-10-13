<template>
  <div class="sass-search-bar">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SearchBar'
}
</script>

<style lang="scss" scoped>
.sass-search-bar{
  width: 100%;
  margin-bottom: 10px;
  display: flex;
}
</style>
