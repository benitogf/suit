<template>

  <md-layout md-row md-column-small class="content page">

    <md-card>

      <md-dialog-prompt
        v-if="isAdmin"
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
            add content
          </md-button>
          <md-list v-if="isAdmin">
            <md-list-item>
              <span></span>
              <md-switch v-model="edit"></md-switch>
            </md-list-item>
          </md-list>
        </md-layout>
        <md-list-form :edit="edit && isAdmin"
          :mutating="mutating"
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
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Page',
  props: {
    page: Object,
    id: String
  },
  computed: {
    ...mapGetters({
      isAdmin: 'isAdmin'
    })
  },
  data: () => ({
    edit: true,
    mutating: false,
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
      'setPage',
      'subPage',
      'plusPage'
    ]),
    fire () {
      this.setPage({ tag: this.id, page: this.page })
    },
    openDialogSub (ref) {
      this.prompt.title = 'Create content'
      if (ref.id) {
        this.prompt.title += ' in ' + ref.id
      }
      this.prompt.value = ''
      this.$refs.page.open()
      this.ref = ref.id || 'root'
    },
    plus (data) {
      this.mutating = true
      this.plusPage({ tag: this.id, root: data.root, id: data.id })
      this.$nextTick(() => {
        this.mutating = false
      })
    },
    onCloseDialog (ref) {
      if (this.prompt.value && ref === 'ok') {
        this.mutating = true
        this.subPage({ tag: this.id, sub: this.prompt.value, parent: this.ref })
        this.$nextTick(() => {
          this.mutating = false
        })
      }
    }
  },
  mounted () {
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
