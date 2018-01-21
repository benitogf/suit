<template>
  <md-layout md-align="center">
    <page v-if="page" :id="id" :page="page"></page>
  </md-layout>
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
    edit: true
  }),
  watch: {
    'id': function (newId) {
      this.$store.dispatch('getPage', newId)
    }
  },
  created () {
    console.log(this.$route.params.id, this.id)
    this.$store.dispatch('getPage', this.$route.params.id)
  }
}
</script>
