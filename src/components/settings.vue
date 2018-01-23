<template>
  <md-layout class="content">
    <md-tabs class="md-theme-default" md-left>
      <!-- <md-tab id="back" md-label="<">
      </md-tab> -->
      <md-tab md-active id="account" md-label="Account">
        <p>Currently logged in as <b>{{user}}</b></p>
        <md-button @click="logoutAction()" class="md-warn md-raised">
          logout
          <i class="material-icons">exit_to_app</i>
        </md-button>
      </md-tab>

      <md-tab id="storage" md-label="Storage">
        <p>Yep.</p>
      </md-tab>
    </md-tabs>
  </md-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Settings',
  computed: {
    ...mapGetters({
      user: 'currentUser'
    })
  },
  // data: () => ({
  //   firstChange: true
  // }),
  methods: {
    ...mapActions([
      'logout'
    ]),
    async logoutAction () {
      await this.logout()
      this.$nextTick(() => {
        this.$router.push({ name: 'shop' })
      })
    }
    // change (e) {
    //   if (this.firstChange) {
    //     this.firstChange = false
    //   } else {
    //     if (e === 0) {
    //       this.$nextTick(() => {
    //         this.$router.push({ name: 'shop' })
    //       })
    //     }
    //   }
    // }
  },
  mounted () {
    if (!this.user) {
      this.$nextTick(() => {
        this.$router.push({ name: 'shop' })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.material-icons {
  vertical-align: middle;
}
</style>
