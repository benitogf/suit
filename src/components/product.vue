<template>
  <md-card class="md-default product">
    <md-card-actions v-if="showActions">
      <button class="md-button md-primary"
        :disabled="!product.inventory"
        @click="addToBag(product)">Add to bag</button>
    </md-card-actions>

    <md-card-media>
      <router-link exact :to="'/product/'+product.id">
        <img :src="src(product.id)" :alt="product.title">
      </router-link>
    </md-card-media>

    <md-card-header>
      <md-layout v-if="showActions" md-gutter>
        <md-layout :md-flex="product.variants && product.bulks ? 50 : 100" v-for="extra in extras" :key="extra" :class="{
            'extra': product.variants && product.bulks
          }">
          <md-input-container v-if="product[extra+'s']">
            <label :for="extra">{{extra}}</label>
            <md-select :name="extra" :id="extra" v-model="product[extra]">
              <md-option v-for="v in product[extra+'s']" :value="v.label" :key="v.label">{{v.label}}</md-option>
            </md-select>
          </md-input-container>
        </md-layout>
      </md-layout>
      <div class="md-title">{{ product.title }}</div>
      <div class="md-subhead">{{ product.price | currency }}</div>
    </md-card-header>

    <md-card-content>{{ product.description }}</md-card-content>
  </md-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

function calculatePrice () {
  let price = this.product.variants ? this.product.variants.reduce((cat, {label, price}) => {
    if (label === this.product.variant) {
      cat = price
    }
    return cat
  }, '') : this.product.basePrice
  let bulk = this.product.bulks ? this.product.bulks.reduce((cat, {label, factor}) => {
    if (label === this.product.bulk) {
      cat = factor
    }
    return cat
  }, '') : 1
  let quantity = this.product.bulks ? this.product.bulks.reduce((cat, {label, quantity}) => {
    if (label === this.product.bulk) {
      cat = quantity
    }
    return cat
  }, '') : 1
  this.product.price = price * bulk
  this.product.quantity = quantity
}

export default {
  name: 'Product',
  props: {
    product: Object,
    showActions: Boolean
  },
  data: () => ({
    extras: ['variant', 'bulk']
  }),
  computed: {
    ...mapGetters({
      user: 'currentUser',
      profile: 'profile'
    }),
    src () {
      return id => '../static/' + id + '.jpg'
    }
  },
  watch: {
    'product.variant': calculatePrice,
    'product.bulk': calculatePrice
  },
  methods: {
    ...mapActions([
      'addToBag'
    ])
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.product {
  flex: 1;
  .md-title {
    font-size: 15px !important;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
  }
  .md-card-media img {
    width: auto !important;
    display: flex;
    margin: 1rem auto 0;
    max-height: 628px;
  }
  .extra {
    padding: 0 30px 0 5px;
  }
}
</style>
