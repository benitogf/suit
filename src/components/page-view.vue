<template>
  <page v-if="page && !loading" :id="id" :page="page"></page>
</template>

<script>
import { mapGetters } from 'vuex'
import Page from './page.vue'

export default {
  name: 'PageView',
  props: ['id'],
  components: { Page },
  computed: {
    ...mapGetters({
      page: 'page',
      isAdmin: 'isAdmin'
    })
  },
  data: () => ({
    edit: true,
    loading: true
  }),
  watch: {
    '$route.path': function (newId) {
      // console.log('w', newId)
      this.loading = true
      this.$store.dispatch('getPage', newId.replace('/page/', ''))
      this.$nextTick(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    // route params don't propagate due to the store filter for the route mutation
    // console.log('m', this.id)
    this.$store.dispatch('getPage', this.$route.path.replace('/page/', ''))
    this.$nextTick(() => {
      this.loading = false
    })
  }
}
</script>
