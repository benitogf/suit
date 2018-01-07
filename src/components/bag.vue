<template>
  <md-layout md-column md-flex-large="100" md-flex-x-large="30" class="bag">

    <md-card class="md-primary">

      <md-card-header>
        <div class="md-title">Shopping Bag</div>
        <p v-show="checkoutStatus">Checkout {{ checkoutStatus }}.</p>
      </md-card-header>

      <md-card-content>
        <p v-show="!products.length"><i>Please consider adding some products to your bag</i></p>
        <md-list v-if="products.length > 0">
          <md-list-item v-for="(p, index) in products" :key="index" class="bag-item">
            <bag-product :product="p"></bag-product>
            <md-divider v-if="index < products.length - 1"></md-divider>
          </md-list-item>
          <md-list-item>
              <div class="md-subhead">Total: {{ total | currency }}</div>
          </md-list-item>
        </md-list>
      </md-card-content>

      <md-card-actions>
        <router-link class="md-button md-default" exact to="/shop"
          v-if="state !== 'shop'">back to shop
        </router-link>
        <md-button class="md-default md-raised"
          :disabled="!products.length"
          @click.native="checkout(products)">Checkout</md-button>
      </md-card-actions>

    </md-card>

  </md-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BagProduct from './bag-product.vue'

export default {
  name: 'Bag',
  components: { BagProduct },
  computed: {
    ...mapGetters({
      products: 'bagProducts',
      state: 'currentState',
      checkoutStatus: 'checkoutStatus'
    }),
    total () {
      return this.products.reduce((total, p) => {
        return total + p.price * p.quantity
      }, 0)
    }
  },
  watch: {
    'products.length': function () {
      this.$parent.$emit('bag')
    }
  },
  methods: mapActions([
    'removeFromBag',
    'checkout'
  ])
}
</script>

<style lang="scss" scoped>
.md-card {
  flex: 1;
  .md-card-content {
      padding: 10px !important;
  }
}
.bag-item {

    padding: 0 0 0 16px;
}
.md-list {
  .md-divider {
    bottom: -1px;
    right: 93px;
    left: 16px;
  }
}
</style>
