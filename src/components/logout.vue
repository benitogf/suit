<template>
  <md-layout class="content">
  </md-layout>
</template>

<script>
export default {
  name: 'Logout',
  mounted () {
    this.$store.dispatch('logout')
  }
}
</script>
