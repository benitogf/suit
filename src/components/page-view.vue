<template>
  <page class="content" v-if="id" :id="id"></page>
</template>

<script>
import { mapGetters } from 'vuex'
import Page from './page.vue'

export default {
  name: 'PageView',
  components: { Page },
  computed: {
    ...mapGetters({
      page: 'page',
      isAdmin: 'isAdmin'
    })
  },
  data: () => ({
    id: null
  }),
  watch: {
    '$route.path': function (newId) {
      this.id = newId.replace('/page/', '')
    }
  },
  mounted () {
    // route params don't propagate due to the store filter for the route mutation
    // console.log('m', this.id)
    this.id = this.$route.path.replace('/page/', '')
  }
}
</script>
