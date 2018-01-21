<template>
  <md-layout md-column class="content">
    <md-subheader>
      <router-link class="md-button" exact to="/">
        <md-icon md-src="left-arrow">left-arrow</md-icon>
      </router-link>
      <md-layout md-align="end" md-gutter md-flex>
        <md-layout v-if="isAdmin" md-align="end" md-flex="10">
          <md-switch v-model="edit"></md-switch>
        </md-layout>
      </md-layout>
    </md-subheader>
    <md-layout md-align="center">
      <product v-if="product" :showActions="false" :edit="edit" :product="product"></product>
    </md-layout>
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
      product: 'product',
      isAdmin: 'isAdmin'
    })
  },
  data: () => ({
    edit: true
  }),
  created () {
    this.$store.dispatch('getProduct', parseInt(this.$route.params.id))
  }
}
</script>
<style lang="scss" scoped>
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
