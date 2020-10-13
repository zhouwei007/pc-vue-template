<template>
  <div class="sass-form">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Form'
}
</script>

<style lang="scss" scoped>
.sass-form{
  width: 100%;
  margin-bottom: 10px;
  display: flex;
}
</style>
