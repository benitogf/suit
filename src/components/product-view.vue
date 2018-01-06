<template>
  <md-layout md-row class="content">
    <md-layout md-column md-flex="100" v-if="product">
      <md-subheader>
        <router-link class="md-button" exact to="/shop">
          <md-icon md-src="left-arrow">left-arrow</md-icon>
        </router-link>
        <md-layout md-align="end" md-gutter>
          <md-layout md-flex="30" v-if="product[extra+'s']" v-for="extra in extras" :key="extra" class="extra">
            <md-input-container>
              <label :for="extra">{{extra}}</label>
              <md-select :name="extra" :id="extra" v-model="product[extra]">
                <md-option v-for="v in product[extra+'s']" :value="v.label" :key="v.label">{{v.label}}</md-option>
              </md-select>
            </md-input-container>
          </md-layout>
          <md-layout md-flex="30">
            <h2 class="md-title tag">{{ product.title }} <span>{{ product.price | currency }}</span></h2>
          </md-layout>
        </md-layout>
        <button class="md-button md-primary"
          :disabled="!product.inventory"
          @click="addToBag(product)">Add to bag</button>
      </md-subheader>
      <product :showActions="false" :product="product"></product>
    </md-layout>
  </md-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Product from './product.vue'

export default {
  name: 'ProductView',
  components: { Product },
  computed: {
    ...mapGetters({
      product: 'currentProduct'
    }),
    src () {
      return id => '../static/' + id + '.jpg'
    }
  },
  data: () => ({
    extras: ['variant', 'bulk']
  }),
  methods: mapActions([
    'addToBag'
  ]),
  created () {
    this.$store.dispatch('getProduct', parseInt(this.$route.params.id))
  }
}
</script>
<style lang="scss" scoped>
.tag {
  text-align: center;
  flex: 1;
  padding: 1.855rem 0 0;
  line-height: unset;
  margin: 0;
}
.extra {
  padding: 15px;
  .md-input-container {
    margin: 0;
  }
}
</style>
