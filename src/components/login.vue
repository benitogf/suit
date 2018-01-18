<template>
  <md-layout md-column md-flex md-align="center">
    <md-card class="login">
      <md-card-header>
        <div class="md-title">
          <img class="logo" src="../assets/logo.png">
        </div>
        <div class="md-subhead">v0.1</div>
      </md-card-header>

      <md-card-content>
        <span v-if="error !== ''">{{error}}</span>
        <form novalidate @submit.stop.prevent.native="login(user)">
          <md-input-container>
            <label>Username</label>
            <md-input v-model="user.account" @keyup.native.13="login(user)"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Password</label>
            <md-input v-model="user.password" type="password" @keyup.native.13="login(user)"></md-input>
          </md-input-container>
        </form>
      </md-card-content>

      <md-card-actions>
        <router-link class="md-button" exact to="/">
          <md-icon md-src="left-arrow">left-arrow</md-icon>
        </router-link>
        <md-button @click.native="login(user)">Login</md-button>
      </md-card-actions>
    </md-card>
  </md-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import router from '@/router'

export default {
  name: 'login',
  computed: {
    ...mapGetters({
      error: 'loginError',
      currentUser: 'currentUser'
    })
  },
  data: function () {
    return {
      user: {
        account: '',
        password: '',
        role: ''
      }
    }
  },
  methods: mapActions([
    'login'
  ]),
  mounted () {
    if (this.currentUser) {
      router.push({ name: 'home' })
    }
  }
}
</script>

<style lang="scss" scoped>
@media (min-width: 1281px) {
    padding-left: 0 !important;
}
.logo {
    width: 67px;
}
.md-card {
  min-width: 360px;
  align-self: flex-center;
}
.md-column {
  height: inherit;
  align-items: center;
}
</style>
