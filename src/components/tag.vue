<template>

  <md-layout md-row md-column-small class="content tag">

    <md-card>

      <md-dialog-prompt
        v-if="user"
        :md-theme="prompt.theme"
        :md-title="prompt.title"
        :md-ok-text="prompt.ok"
        :md-cancel-text="prompt.cancel"
        @close="onCloseDialog"
        v-model="prompt.value"
        ref="page">
      </md-dialog-prompt>

      <md-card-area md-inset>
        <md-card-header>
          <h2 class="md-title">{{id}}</h2>
          <div class="md-subhead">
            <span></span>
          </div>
        </md-card-header>
      </md-card-area>

      <md-card-content v-if="page">
        <md-layout md-align="end">
          <md-button class="md-primary" v-if="edit && isAdmin" @click.native="openDialogSub({ })">
            add field
          </md-button>
          <md-list v-if="isAdmin">
            <md-list-item>
              <span></span>
              <md-switch v-model="edit"></md-switch>
            </md-list-item>
          </md-list>
        </md-layout>
        <md-list-form :fields="page"
          :edit="edit && isAdmin"
          :level="0"
          @sub="openDialogSub"
          @plus="plus"
          @fire="fire">
        </md-list-form>
      </md-card-content>

    </md-card>

  </md-layout>

</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'tag',
  props: ['id'],
  computed: {
    ...mapGetters({
      user: 'currentUser',
      profile: 'profile',
      isAdmin: 'isAdmin'
    })
  },
  data: () => ({
    page: null,
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
      'getPage',
      'setPage'
    ]),
    fire () {
      this.setPage({ tag: this.id, page: this.page })
    },
    openDialogSub (ref) {
      this.prompt.title = 'Create field'
      if (ref.id) {
        this.prompt.title += ' in ' + ref.id
      }
      this.prompt.value = ''
      this.$refs.page.open()
      this.ref = ref.id || 'root'
    },
    plus (data) {
      let page = Object.assign({}, this.page)
      let form = _.findIndex(page[data.root], ['id', data.id])
      page[data.root][form].data.push({})
      this.setPage({ tag: this.id, page: page })
    },
    async onCloseDialog (ref) {
      if (this.prompt.value && ref === 'ok') {
        let page = Object.assign({}, this.page)
        if (!page[this.ref]) {
          page[this.ref] = []
        }
        if (!page[this.prompt.value]) {
          page[this.prompt.value] = []
        }
        page[this.ref].push({
          parent: this.ref,
          id: this.prompt.value,
          data: [{}]
        })
        await this.setPage({ tag: this.id, page: page })
        await this.reload()
      }
    },
    async reload () {
      let base = {
        root: []
      }
      let page = await this.getPage(this.id)
      if (Object.keys(page).length === 0) {
        page = base
      }
      this.page = page
    }
  },
  watch: {
    async id () {
      Vue.nextTick(async () => {
        await this.reload()
      })
    }
  },
  async mounted () {
    await this.reload()
  }
}
</script>
<style lang="scss" scoped>
.md-card {
  flex-grow: 1;
  & > .md-card-area .md-card-header {
    padding-bottom: 0;
    padding-top: 0;
  }
  & > .md-card-content:last-child {
    padding-top: 0;
  }
  & > .md-button {
    margin: 0;
  }
}
</style>
