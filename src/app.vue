<template>
  <div class="container">
    <md-dialog-confirm :md-title="confirm.title"
      :md-content-html="confirm.contentHtml"
      :md-ok-text="confirm.ok"
      md-cancel-text="cancel"
      @close="onCloseConfirm"
      ref="removeConfirm">
    </md-dialog-confirm>

    <md-dialog-prompt :md-theme="prompt.theme"
      :md-title="prompt.title"
      :md-ok-text="prompt.ok"
      :md-cancel-text="prompt.cancel"
      @close="onCloseDialog"
      v-model="prompt.value"
      ref="tag">
    </md-dialog-prompt>

    <md-whiteframe v-if="state !== 'login'" md-tag="md-toolbar" md-elevation="1" class="top-toolbar">
      <md-button v-if="!loading" class="md-icon-button nav-trigger" @click="toggleSidenav">
        <md-icon md-src="menu">menu</md-icon>
      </md-button>
      <h2 class="md-title" :class="{
        'page-title': !loading
      }">{{ title }}</h2>
      <md-layout v-if="state !== 'settings' && !loading" md-align="end">
        <md-button class="md-icon-button" @click.native="toggleRightSidenav">
            <i class="material-icons">local_mall</i>
        </md-button>
      </md-layout>
    </md-whiteframe>
    <md-layout md-flex="100" v-if="loading">
      <md-progress md-indeterminate></md-progress>
    </md-layout>

    <md-sidenav v-if="state !== 'login'" class="nav-sidebar md-left md-fixed" md-swipeable ref="leftSidenav">
      <md-toolbar class="logo">
        <router-link exact to="/">
          <md-icon md-src="corsarial"></md-icon>
        </router-link>
      </md-toolbar>

      <md-list v-if="isAdmin && state !== 'settings'  && !loading">
        <md-list-item>
          <md-layout md-align="end">
          <md-button class="md-primary" v-if="edit && isAdmin" @click.native="openDialog(false)">
            add tag
          </md-button>
          <md-list>
            <md-list-item>
              <span></span>
              <md-switch v-model="edit"></md-switch>
            </md-list-item>
          </md-list>
          </md-layout>
        </md-list-item>
      </md-list>

      <md-list-tree v-if="tags  && !loading" :edit="edit && isAdmin && state !== 'settings'" :tags="tags" @add="openDialog" @del="openConfirm"></md-list-tree>

      <md-list v-if="availableRoutes  && !loading" class="sidenav-static-links">
        <md-list-item v-for="r in availableRoutes" :key="r.name">
          <router-link exact :to="r.path">
            {{r.name}}
          </router-link>
        </md-list-item>
        <md-list-item v-if="user">
          <router-link exact to="/settings">
            settings
          </router-link>
        </md-list-item>
        <md-list-item v-if="!user">
          <router-link exact to="/login">
            login
          </router-link>
        </md-list-item>
      </md-list>

    </md-sidenav>

    <md-sidenav v-if="state !== 'login' && state !== 'settings' && !loading" class="md-right" ref="rightSidenav">

      <md-toolbar class="md-right-close">
        <div class="md-title">
          <i class="material-icons">local_mall</i>
          <i class="material-icons">content_paste</i>
        </div>
        <md-layout md-align="end">
          <md-button class="md-icon-button" @click.native="closeRightSidenav">
            <md-icon md-src="close">close</md-icon>
          </md-button>
        </md-layout>
      </md-toolbar>

      <bag @close="close('right')" @open="open('right')"></bag>

    </md-sidenav>

    <transition v-if="!loading" appear name="slide-fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import bag from '@/components/bag.vue'
import router from '@/router'

export default {
  name: 'app',
  toolbar: true,
  components: { bag },
  computed: {
    ...mapGetters({
      user: 'currentUser',
      state: 'currentState',
      tags: 'tags',
      availableRoutes: 'availableRoutes',
      isAdmin: 'isAdmin',
      product: 'product'
    }),
    title: function () {
      if (this.state === 'page') {
        return this.$route.path.replace('/page/', '')
      } else {
        if (this.state === 'product') {
          return this.loading || !this.product ? '' : this.product.name
        } else {
          return this.state
        }
      }
    }
  },
  data: () => ({
    edit: false,
    loading: true,
    removing: null,
    confirm: {
      title: 'confirm',
      contentHtml: 'confirm',
      ok: 'ok'
    },
    prompt: {
      title: 'Create tag',
      ok: 'Done',
      cancel: 'Cancel',
      id: 'name',
      name: 'name',
      placeholder: 'Type the name...',
      maxlength: 30,
      value: '',
      theme: 'white'
    }
  }),
  methods: {
    ...mapActions([
      'setTags',
      'delTag'
    ]),
    openDialog (ref) {
      this.prompt.title = 'Create tag'
      if (ref) {
        this.prompt.title += ' in ' + ref.id
      }
      this.prompt.value = ''
      this.$refs.tag.open()
      this.ref = ref.id || 'root'
    },
    closeDialog (ref) {
      this.$refs.tag.close()
    },
    onCloseDialog (ref) {
      if (this.prompt.value && ref === 'ok') {
        let tags = Object.assign({}, this.tags)
        if (!tags[this.ref]) {
          tags[this.ref] = []
        }
        tags[this.ref].push(this.prompt.value)
        this.setTags(tags)
      }
    },
    openConfirm (ref) {
      this.removing = ref
      this.confirm = {
        subject: 'extra',
        title: 'Removal confirmation',
        ok: 'OK remove the tag'
      }

      this.confirm.contentHtml = 'Please confirm that you wish to remove the tag of <b>' + ref.id + '</b> and all sub tags attached to it'
      this.$refs.removeConfirm.open()
    },
    onCloseConfirm (response) {
      if (response === 'ok') {
        this.edit = false
        this.delTag({ id: this.removing.id, root: this.removing.root })
        if (this.$route.name === 'page' && this.$route.params.id === this.removing.id) {
          this.$nextTick(() => {
            router.push({ name: 'shop' })
          })
        } else {
          this.$nextTick(() => {
            this.edit = true
          })
        }
      }
    },
    toggleSidenav () {
      this.$refs.leftSidenav.toggle()
    },
    closeSidenav () {
      if (this.$refs.leftSidenav) {
        this.$refs.leftSidenav.close()
      }
    },
    toggleRightSidenav () {
      this.$refs.rightSidenav.toggle()
    },
    closeRightSidenav () {
      this.$refs.rightSidenav.close()
    },
    open (ref) {
      this.$refs[ref + 'Sidenav'].open()
    },
    close (ref) {
      this.$refs[ref + 'Sidenav'].close()
    },
    logout () {
      this.$refs.rightSidenav.close()
      return this.$store.dispatch('logout')
    }
  },
  mounted () {
    const self = this
    self.$store._vm.$root.$on('storageReady', () => {
      this.$store.dispatch('getTags')
      self.loading = false
      router.beforeEach((to, from, next) => {
        self.loading = true
        self.closeSidenav()
        next()
        setTimeout(() => { self.loading = false }, 900)
      })
    })
  }
}
</script>

<style lang="scss">
  @import 'src/components/material/core/stylesheets/variables.scss';

  [v-cloak] {
    display: none;
  }

  html,
  body {
    height: 100%;
    overflow: hidden;
  }

  body {
    display: flex;
  }

  .container {
    min-height: 100%;
    display: flex;
    flex-flow: column nowrap;
    flex: 1;
    // transition: $swift-ease-out;
  }

  // @media (min-width: $breakpoint-xlarge +1) {
  //   .content {
  //     margin-right: $sidenav-width;
  //   }
  //   .top-toolbar, .md-right-close {
  //     display: none !important;
  //   }
  // }

  code {
    &:not(.hljs) {
      margin-left: 1px;
      margin-right: 1px;
      padding: 0 4px;
      display: inline-block;
      border-radius: 2px;
      font-family: "Operator Mono", "Fira Code", Menlo, Hack, "Roboto Mono", "Liberation Mono", Monaco, monospace;

      pre {
        margin: 8px 0;
      }
    }
  }
  .md-subheader {
    a {
      margin-left: 0;
    }
  }
  .md-button {
    min-width: 56px !important;
  }

  .content {
      overflow-y: auto;
      min-width: unset !important;
  }

  @media (min-width: $breakpoint-large +1) {
    .page-title {
      margin-left: $sidenav-width - 65px !important;
    }
    .content {
      margin-left: $sidenav-width;
    }
  }

  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  .slide-fade-enter-active {
    transition: all .5s ease;
  }

  .slide-fade-leave-active {
    transition: none;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(15px);
    opacity: 0;
  }

  .slide-fade-leave, .slide-fade-leave-to, .slide-fade-leave-active {
    position: absolute;
    z-index: -2;
    opacity: 0;
  }

  .sidenav-static-links {
    padding: 0 !important;
    a.md-button {
      margin: 0;
    }
  }
</style>
