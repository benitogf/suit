<template>
  <div class="content">
    <a class="md-button" :href="src" target="_blank">vm</a>
  </div>
</template>

<script>
export default {
  name: 'hello',
  computed: {
    src () {
      return 'https://xkcd.com/1764/'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}
</style>
