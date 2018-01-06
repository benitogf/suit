<template>
  <md-layout md-row md-column-small class="column-reverse content">
    <product-list></product-list>
  </md-layout>
</template>

<script>
import ProductList from './product-list.vue'

export default {
  name: 'Shop',
  components: { ProductList }
}
</script>

<style lang="scss" scoped>
@import './material/core/stylesheets/variables.scss';
</style>
