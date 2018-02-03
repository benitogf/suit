<template>
  <md-layout class="product">
    <md-image class="product-preview" v-if="product.picture" :md-src="product.picture" :alt="product.name"></md-image>
    <i v-else class="material-icons product-picture">wallpaper</i>
    <md-layout md-column class="product-info">
      <small>{{ product.name }} {{ product.variant ? ' - ' + product.variant : '' }}</small>
      <small>{{ product.bulk ? '(' + product.bulk + ') x ' : ' x '   }} {{ product.quantity }}</small>
      <b>{{ total | currency }}</b>
      <md-button class="md-icon-button md-warn remove-from-bag" @click.native="removeFromBag(product)">
        <i class="material-icons">remove_circle</i>
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
  computed: {
    total () {
      if (!this.product.bulk) {
        return this.product.price * this.product.quantity
      } else {
        return this.product.price * (this.product.quantity / this.product.bulkQuantity)
      }
    }
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
.remove-from-bag {
  position: absolute !important;
  top: 3px;
  right: -10px;
}
.product {
  margin-bottom: 10px;
  margin-top: 10px;
}
.product-picture {
  font-size: 3em;
  color: #ccc;
  background-color: rgba(0, 0, 0, .12);
  width: 130px;
  height: 2.2em;
  line-height: 2.2em;
  text-align: center;
}
.product-preview {
  height: 150px;
}
.product-info {
  padding: 15px;
  small {
    margin-top: 10px;
    font-size: 0.7em;
  }
  b {
    position: absolute;
    bottom: 11px;
    right: 24px;
  }
}
</style>
