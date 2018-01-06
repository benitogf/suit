<template>
  <md-layout md-column md-flex="100" class="product-list">
    <md-layout md-gutter>
      <md-layout class="product" md-column md-gutter v-for="p in products" :key="p.id" md-margin>
        <product :showActions="true" :product="p"></product>
      </md-layout>
    </md-layout>
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Product from './product.vue'

export default {
  name: 'ProductList',
  components: { Product },
  computed: {
    ...mapGetters({
      products: 'allProducts'
    })
  },
  created () {
    this.$store.dispatch('getAllProducts')
  }
}
</script>

<style lang="scss" scoped>
  @import 'src/components/material/core/stylesheets/variables.scss';

  .md-card {
    .md-title {
      font-size: 15px !important;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
    }

    .md-card-media img {
      width: auto !important;
      display: flex;
      margin: auto;
      max-height: 628px;
    }
  }

  .product {
    padding: 1rem;
    flex: 1;
    max-width: unset;
    min-width: unset;

    @media (max-width: $breakpoint-small) {
      max-width: 100%;
      min-width: 100%;
    }

    @media (max-width: $breakpoint-medium) {
      max-width: 100%;
      min-width: 100%;
    }

    @media (min-width: $breakpoint-medium) {
      max-width: 24rem;
      min-width: 20.5rem;
    }

    @media (min-width: $breakpoint-xmedium) {
      max-width: 21rem;
      min-width: 20rem;
    }

    @media (min-width: $breakpoint-large) {
      max-width: 22.9rem;
      min-width: 20.9rem;
    }

    @media (min-width: $breakpoint-xlarge +1) {
      max-width: 23rem;
      min-width: 18rem;
    }

    @media (min-width: $breakpoint-xxlarge) {
      max-width: 29rem;
      min-width: 22rem;
    }

    @media (min-width: $breakpoint-xxxlarge) {
      max-width: 54rem;
      min-width: 41rem;
    }

  }
</style>
