<template>
  <md-layout md-column md-flex class="login">
    <md-card>
      <md-card-header>
        <div class="md-title">
          <img class="logo" src="../assets/logo.png">
        </div>
        <div class="md-subhead">v0.1</div>
      </md-card-header>

      <md-card-content>
        <md-progress v-if="loading" md-indeterminate></md-progress>
        <span v-if="!loading && error !== ''">{{error}}</span>
        <form v-if="!loading" novalidate @submit.stop.prevent.native="submit(user)">
          <md-input-container>
            <label>Username</label>
            <md-input autofocus ref="username" v-model="user.account" @keyup.native.13="submit(user)"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Password</label>
            <md-input v-model="user.password" type="password" @keyup.native.13="submit(user)"></md-input>
          </md-input-container>
        </form>
      </md-card-content>

      <md-card-actions v-if="!loading">
        <router-link class="md-button" exact to="/">
          <md-icon md-src="left-arrow">left-arrow</md-icon>
        </router-link>
        <md-button @click.native="submit(user)">Login</md-button>
      </md-card-actions>
    </md-card>
  </md-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'login',
  computed: {
    ...mapGetters({
      error: 'loginError',
      currentUser: 'currentUser'
    })
  },
  data: () => ({
    loading: false,
    user: {
      account: '',
      password: '',
      role: ''
    }
  }),
  methods: {
    ...mapActions([
      'login'
    ]),
    async submit (data) {
      this.loading = true
      await this.login(data)
      this.$nextTick(() => {
        setTimeout(() => {
          if (!this.error) {
            this.$router.push({ name: 'shop' })
          } else {
            this.loading = false
          }
        }, 700)
      })
    }
  },
  mounted () {
    if (this.currentUser) {
      this.$router.push({ name: 'shop' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/components/material/core/stylesheets/variables.scss';

.logo {
    width: 67px;
}
.login {
  @media (min-width: $breakpoint-small + 1) {
    justify-content: center;
  }
}
.md-card {
  min-width: 320px;

}
.md-column {
  height: inherit;
  align-items: center;
}
</style>
