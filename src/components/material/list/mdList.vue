<template>
  <ul class="md-list" :class="[themeClass]">
    <slot></slot>
  </ul>
</template>

<style lang="scss" src="./mdList.scss"></style>

<script>
  import theme from '@/components/material/theme/mixin'

  export default {
    name: 'md-list',
    mixins: [theme]
  }
</script>
