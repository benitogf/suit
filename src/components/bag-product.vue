<template>
  <md-layout class="product">
    <img class="product-preview" :src="product.picture" :alt="product.name">
    <md-layout md-column class="product-info">
      <small>{{ product.name }} - {{ product.variant }} {{ product.bulk ? '(' + product.bulk + ') x ' : ' x '   }} {{ product.quantity }}</small>
      <b>{{ product.price | currency }}</b>
      <md-button class="md-icon-button md-warn" @click.native="removeFromBag(product)">
        <i class="material-icons">delete_forever</i>
      </md-button>
    </md-layout>
  </md-layout>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'BagProduct',
  props: {
    product: Object
  },
  watch: {
    'product.quantity': function () {
      this.$emit('open')
    }
  },
  methods: mapActions([
    'removeFromBag',
    'checkout'
  ])
}
</script>

<style lang="scss" scoped>
.md-button {
  position: absolute !important;
  top: 3px;
  right: 0;
}
.product {
  margin-bottom: 10px;
  margin-top: 10px;
}
.product-preview {
  height: 150px;
}
.product-info {
  padding: 15px;
  small {
    margin-top: 33px;
  }
  b {
    text-align: right;
  }
}
</style>
