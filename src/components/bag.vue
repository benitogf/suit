<template>
  <md-layout md-column md-flex-large="100" md-flex-x-large="30" class="bag">

    <md-card class="md-primary">

      <md-card-actions>
        <md-layout md-column>
          <md-layout md-row md-align="end">
            <md-button md-flex class="md-default md-raised keep"
              @click="keepShopping()">keep shopping</md-button>
            <md-button class="md-accent md-raised"
              :disabled="!products.length"
              @click.native="checkout(products)">Checkout</md-button>
          </md-layout>
          <md-layout md-row class="total-container">
            <div class="md-title total-title">Total</div>
            <div class="md-title total">{{ total | currency }}</div>
          </md-layout>
        </md-layout>
      </md-card-actions>

      <md-card-header v-show="checkoutStatus">
        <p>Checkout {{ checkoutStatus }}.</p>
      </md-card-header>

      <md-card-content>
        <p v-show="!products.length"><i>Please consider adding some products to your bag</i></p>
        <md-list v-if="products.length > 0" class="md-theme-primary">
          <md-list-item v-for="(product, index) in products" :key="index">
            <bag-product @open="open()" :product="product"></bag-product>
            <md-divider v-if="index !== products.length - 1"></md-divider>
          </md-list-item>
        </md-list>
      </md-card-content>

    </md-card>

  </md-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BagProduct from './bag-product.vue'
import router from '@/router'

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
      return this.products.reduce((total, product) => {
        if (!product.bulk) {
          return total + product.price * product.quantity
        } else {
          return total + product.price * (product.quantity / product.bulkQuantity)
        }
      }, 0)
    }
  },
  watch: {
    'products.length': function (newLenght) {
      if (newLenght > 0) {
        this.open()
      }
    }
  },
  methods: {
    ...mapActions([
      'removeFromBag',
      'checkout'
    ]),
    keepShopping () {
      this.$emit('close')
      if (this.state !== 'shop') {
        router.push({ name: 'shop' })
      }
    },
    open () {
      this.$emit('open')
    }
  }
}
</script>

<style lang="scss" scoped>
.total, .total-title {
  flex: 1;
  font-size: 22px !important;
}
.total {
  padding-right: 15px;
  text-align: right;
}
.total-title {
  font-weight: bold !important;
  padding-left: 61px;
}
.total-container {
  padding-top: 15px;
}
.md-divider {
  width: 88%;
}
.md-card {
  flex: 1;
  .md-card-content {
    padding: 0 !important;
  }
  .md-card-actions {
    display: block;
  }
}
.keep {
  flex: 1;
}
.md-list {
  .md-divider {
    bottom: -1px;
    right: 93px;
    left: 16px;
  }
}
</style>
