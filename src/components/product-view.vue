<template>
  <md-layout class="content product-view">
    <md-card class="md-default">
      <md-card-content v-if="product && products">
        <md-tabs @change="change" class="products-tabs md-theme-default">
          <md-tab :md-active="pr.id === product.id" v-for="pr in products" :key="pr.id" :id="pr.id+pr.name" :md-label="pr.name"></md-tab>
        </md-tabs>
        <product @edit="editToggle" :showActions="false" :edit="edit" :product="product"></product>
      </md-card-content>
    </md-card>
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Product from './product.vue'

export default {
  name: 'ProductView',
  components: { Product },
  computed: {
    ...mapGetters({
      products: 'products',
      product: 'product',
      isAdmin: 'isAdmin'
    })
  },
  data: () => ({
    edit: true,
    firstLoad: true
  }),
  methods: {
    change (e) {
      if (e !== this.product.id) {
        if (this.firstLoad) {
          this.firstLoad = false
          if (this.product.id < e) {
            this.$router.push({ name: 'product', params: { id: e } })
          }
        } else {
          this.$router.push({ name: 'product', params: { id: e } })
        }
      }
    },
    editToggle (e) {
      this.edit = e
    }
  },
  created () {
    // route params don't propagate due to the store filter for the route mutation
    // this.$store.dispatch('getProduct', parseInt(this.$route.params.id))
    this.$store.dispatch('getProduct', parseInt(this.$route.path.replace('/product/', '')))
  }
}
</script>
<style lang="scss" scoped>
.md-card {
  flex: 1;
}
.products-tabs {
  transform: translate3d(0px, 0px, 0px);
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
}
.md-title {
  font-size: 20px !important;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  line-height: 55px;
}
.md-subhead {
  margin-left: 10px;
  line-height: 55px;
}
.tag {
  text-align: right;
  flex: 1;
  padding: 0.855rem 0 0;
  line-height: unset;
  margin: 0;
}
.extra {
  .md-input-container {
    margin: 0;
    max-width: 240px;
  }
}
.edit-switch {
  padding: 8px;
}
</style>
