<template>
  <md-layout md-column md-flex="100" class="content">
    <md-layout md-gutter>
      <quill v-bind:id="'admin' + user.account" :edit="!!user" class="quill-container"></quill>
    </md-layout>
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters({
      user: 'currentUser',
      profile: 'profile'
    })
  },
  mounted () {
  }
}
</script>
