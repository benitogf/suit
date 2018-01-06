<template>
  <div class="container">
    <md-dialog-prompt v-if="user"
      :md-theme="prompt.theme"
      :md-title="prompt.title"
      :md-ok-text="prompt.ok"
      :md-cancel-text="prompt.cancel"
      @close="onCloseDialog"
      v-model="prompt.value"
      ref="tag">
    </md-dialog-prompt>

    <md-whiteframe v-if="state !== 'login'" md-tag="md-toolbar" md-elevation="1" class="top-toolbar">
      <md-button class="md-icon-button nav-trigger" @click="toggleSidenav">
        <md-icon md-src="menu">menu</md-icon>
      </md-button>
      <md-layout md-align="end">
        <md-button class="md-icon-button" @click.native="toggleRightSidenav">
            <md-icon md-src="left-arrow">left-arrow</md-icon>
        </md-button>
      </md-layout>
    </md-whiteframe>

    <md-sidenav v-if="state !== 'login'" class="nav-sidebar md-left md-fixed" md-swipeable ref="leftSidenav">
      <md-toolbar class="logo">
        <router-link exact to="/">
          <md-icon md-src="corsarial"></md-icon>
        </router-link>
      </md-toolbar>

      <md-list v-if="user">
        <md-list-item>
          <span></span><md-switch v-model="edit" id="edit-sidenav-toggle" name="edit-sidenav-toggle"></md-switch>
        </md-list-item>
      </md-list>

      <md-list v-if="availableRoutes" class="sidenav-static-links">
        <md-list-item v-for="r in availableRoutes" :key="r.name">
          <router-link exact :to="r.path">
            {{r.name}}
          </router-link>
        </md-list-item>
      </md-list>

      <md-list-tree :edit="edit && !!user" :tags="tags" @action="openDialog"></md-list-tree>

    </md-sidenav>

    <md-sidenav v-if="state !== 'login'" class="md-right" ref="rightSidenav" @bag="open('right')">

      <md-toolbar class="md-right-close">
        <md-layout md-align="end">
          <md-button class="md-icon-button" @click.native="closeRightSidenav">
            <md-icon md-src="close">close</md-icon>
          </md-button>
        </md-layout>
      </md-toolbar>

      <bag></bag>

    </md-sidenav>

    <transition appear name="slide-fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import bag from '@/components/bag.vue'

export default {
  name: 'app',
  toolbar: true,
  components: { bag },
  computed: {
    ...mapGetters({
      user: 'currentUser',
      state: 'currentState',
      tags: 'getTags',
      availableRoutes: 'availableRoutes'
    })
  },
  data: () => ({
    edit: true,
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
      'setTags'
    ]),
    openDialog (ref) {
      this.prompt.title = 'Create tag'
      if (ref) {
        this.prompt.title += ' in ' + ref
      }
      this.prompt.value = ''
      this.$refs.tag.open()
      this.ref = ref || 'root'
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
    toggleSidenav () {
      this.$refs.leftSidenav.toggle()
    },
    closeSidenav () {
      this.$refs.leftSidenav.close()
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
    transition: $swift-ease-out;
  }

  @media (min-width: $breakpoint-xlarge +1) {
    .content {
      margin-right: $sidenav-width;
    }
    .top-toolbar, .md-right-close {
      display: none !important;
    }
  }

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
      @media (min-width: $breakpoint-large +1) {
        margin-left: $sidenav-width;
      }
      min-width: unset !important;
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

  .sidenav-static-links {
    padding: 0 !important;
    .md-button {
      margin: 0;
    }
  }
</style>
