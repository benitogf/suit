<template>
  <md-layout md-column class="content">

    <md-dialog ref="productForm" v-if="edit && isAdmin">
      <md-dialog-title>add new product</md-dialog-title>
      <md-dialog-content>
        <form>
          <md-input-container>
            <label for="base">Base product</label>
            <md-select name="base" id="base" v-model="baseProduct">
              <md-option value="">default</md-option>
              <md-option v-for="(product, index) in products" :value="index" :key="product.id">{{product.name}}</md-option>
            </md-select>
          </md-input-container>
        </form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="closeProductForm(false)">cancel</md-button>
        <md-button class="md-primary" @click="closeProductForm(true)">add product</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-subheader v-if="isAdmin">
      <md-layout md-align="end">
        <md-button v-if="edit" @click="productForm()" class="md-button md-primary">Add product</md-button>
        <md-list>
          <md-list-item>
            <md-switch v-model="edit"></md-switch>
          </md-list-item>
        </md-list>
      </md-layout>
    </md-subheader>

    <md-layout md-flex class="product-list">
      <product class="product" v-for="product in products" :key="product.id" :showActions="true" :edit="edit" :product="product"></product>
    </md-layout>

  </md-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Product from './product.vue'
import placeholderPicture from '../../api/pictures/default'

export default {
  name: 'Shop',
  components: { Product },
  computed: {
    ...mapGetters({
      products: 'products',
      isAdmin: 'isAdmin'
    })
  },
  data: () => ({
    edit: true,
    baseProduct: 0,
    defaultProduct: {
      id: 0,
      picture: placeholderPicture,
      name: 'new product',
      price: 8.88,
      basePrice: 8.88,
      inventory: 1,
      quantity: 1,
      description: 'just a new product.'
    }
  }),
  methods: {
    ...mapActions([
      'addProduct'
    ]),
    productForm () {
      this.$refs.productForm.open()
    },
    closeProductForm (add) {
      this.$refs.productForm.close()
      if (add) {
        if (this.baseProduct === '') {
          this.addProduct(this.defaultProduct)
        } else {
          this.addProduct(this.products[this.baseProduct])
        }
      }
    }
  },
  created () {
    this.$store.dispatch('getProducts')
  }
}
</script>

<style lang="scss" scoped>
@import 'src/components/material/core/stylesheets/variables.scss';
.md-menu-content {
  max-height: 300px;
}

.md-card {
  .md-title {
    font-size: 15px !important;
    font-weight: bold;
    white-space: initial;
    overflow: hidden;
  }

  .md-card-media img {
    width: auto !important;
    display: flex;
    margin: auto;
    max-height: 628px;
  }
}

.product-list {
  flex: 0;
}

.product {
  padding: 1rem;
  flex: 1;
  max-width: unset;
  min-width: unset;

  @media (max-width: $breakpoint-small) {
    max-width: 100vw;
    min-width: 100vw;
  }

  @media (min-width: $breakpoint-small+1) {
    max-width: 48vw;
    min-width: 48vw;
  }

  @media (min-width: $breakpoint-medium) {
    max-width: 50vw;
    min-width: 48vw;
  }

  @media (min-width: $breakpoint-xmedium) {
    max-width: 33vw;
    min-width: 32vw;
  }

  @media (min-width: $breakpoint-large) {
    max-width: 20vw;
    min-width: 25.7vw;
  }

  @media (min-width: $breakpoint-xlarge +1) {
    max-width: 26vw;
    min-width: 26.5vw;
  }

  @media (min-width: $breakpoint-xxlarge) {
    max-width: 20.9vw;
    min-width: 20.6vw;
  }

  @media (min-width: $breakpoint-xxxlarge +1) {
    max-width: 22vw;
    min-width: 22vw;
  }

}
</style>
