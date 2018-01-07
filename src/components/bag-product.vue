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

function findSidenav (root) {
  while (root.$el.classList.value.indexOf('md-sidenav') === -1) {
    root = root.$parent
  }
  return root
}

export default {
  name: 'BagProduct',
  props: {
    product: Object
  },
  watch: {
    'product.quantity': function () {
      console.log('look', this)
      findSidenav(this.$parent).$emit('bag')
    }
  },
  methods: mapActions([
    'removeFromBag',
    'checkout'
  ])
}
</script>
