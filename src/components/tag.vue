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

      <md-card-content v-if="page && page.form">
        <md-list v-if="user">
          <md-list-item>
            <span></span>
            <md-switch v-model="edit"></md-switch>
          </md-list-item>
        </md-list>
        <md-list-form :fields="page.form"
          :edit="edit && !!user"
          :level="0"
          @sub="openDialogSub"
          @plus="plusForm">
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
      profile: 'profile'
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
  methods: Object.assign(mapActions([
    'getPage',
    'setPage'
  ]), {
    openDialogSub (ref) {
      this.prompt.title = 'Create field'
      if (ref.id) {
        this.prompt.title += ' in ' + ref.id
      }
      this.prompt.value = ''
      this.$refs.page.open()
      this.ref = ref.id || 'root'
    },
    plusForm (data) {
      let page = Object.assign({}, this.page)
      let form = _.findIndex(page.form[data.root], ['id', data.id])
      page.form[data.root][form].data.push({})
      this.setPage({ tag: this.id, page: page })
    },
    async onCloseDialog (ref) {
      if (this.prompt.value && ref === 'ok') {
        let page = Object.assign({}, this.page)
        if (!page.form[this.ref]) {
          page.form[this.ref] = []
        }
        if (!page.form[this.prompt.value]) {
          page.form[this.prompt.value] = []
        }
        page.form[this.ref].push({
          id: this.prompt.value,
          data: [{}]
        })
        this.setPage({ tag: this.id, page: page })
        await this.reload()
      }
    },
    async reload () {
      let base = {
        form: {
          root: []
        }
      }
      try {
        let page = await this.getPage(this.id)
        if (!page) {
          page = base
        }
        this.page = page
      } catch (e) {
        this.page = base
      }
    }
  }),
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
.vue-quill .ql-editor {
  box-shadow: 0px 1.6px 10.6px rgba(221, 221, 221, 0.71);
}
</style>
