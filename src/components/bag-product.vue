<template>
  <div>
    <small>{{ product.title }} - <b>{{ product.price | currency }}</b> x {{ product.quantity }}</small>
    <md-button class="md-warn" @click.native="removeFromBag(product)">
      <md-icon md-src="close">close</md-icon>
    </md-button>
  </div>
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
