<template>

  <md-layout md-column class="page">

    <md-dialog-confirm
      v-if="isAdmin"
      :md-title="confirm.title"
      :md-content-html="confirm.contentHtml"
      :md-ok-text="confirm.ok"
      md-cancel-text="cancel"
      @close="onCloseConfirm"
      ref="removeConfirm">
    </md-dialog-confirm>

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

    <md-whiteframe v-if="isAdmin" md-elevation="0" class="page-admin">
      <md-layout md-align="end">
        <md-button v-if="edit" @click="openDialogSub({})" class="md-button md-primary">add content</md-button>
        <md-switch v-model="edit"></md-switch>
      </md-layout>
    </md-whiteframe>

    <md-list-form v-if="!newContent && page && !loading" :edit="edit && isAdmin"
      :mutating="mutating"
      :level="0"
      @sub="openDialogSub"
      @del="openConfirm"
      @plus="plus"
      @fire="fire">
    </md-list-form>

  </md-layout>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Page',
  props: {
    id: String
  },
  computed: {
    ...mapGetters({
      isAdmin: 'isAdmin',
      page: 'page'
    })
  },
  data: () => ({
    loading: true,
    edit: true,
    mutating: false,
    newContent: false,
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
      'getPage',
      'setPage',
      'subPage',
      'plusPage',
      'delSubPage',
      'delPageContent'
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
    openConfirm (ref) {
      this.removing = ref
      this.confirm = {
        subject: 'extra',
        title: 'Removal confirmation',
        ok: 'OK remove the content'
      }

      if (!ref.sub) {
        this.confirm.contentHtml = 'Please confirm that you wish to remove the content of <b>' + ref.id + '</b> and all sub sections attached to it'
      } else {
        this.confirm.contentHtml = 'Please confirm that you wish to remove the last block content of <b>' + ref.id + '</b>'
      }
      this.$refs.removeConfirm.open()
    },
    plus (data) {
      this.edit = false
      this.plusPage({ tag: this.id, root: data.root, id: data.id })
      this.$nextTick(() => {
        this.edit = true
      })
    },
    onCloseDialog (ref) {
      if (this.prompt.value && ref === 'ok') {
        this.newContent = this.ref === 'root' && !this.page[this.ref].data
        this.subPage({ tag: this.id, sub: this.prompt.value, parent: this.ref })
        if (this.newContent) {
          this.$nextTick(() => {
            this.newContent = false
          })
        } else {
          this.mutating = true
          this.$nextTick(() => {
            this.mutating = false
          })
        }
      }
    },
    onCloseConfirm (response) {
      if (response === 'ok') {
        if (!this.removing.sub) {
          this.mutating = true
          this.delPageContent({ tag: this.id, root: this.removing.root, id: this.removing.id })
          this.$nextTick(() => {
            this.mutating = false
          })
        } else {
          this.edit = false
          this.delSubPage({ tag: this.id, root: this.removing.root, id: this.removing.id })
          this.$nextTick(() => {
            this.edit = true
          })
        }
      }
    }
  },
  watch: {
    'edit': function () {
      this.$emit('edit', this.edit)
    },
    'id': function () {
      this.loading = true
      this.$store.dispatch('getPage', this.id)
      this.$nextTick(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.$store.dispatch('getPage', this.id)
    this.$nextTick(() => {
      this.loading = false
    })
  }
}
</script>
<style lang="scss" scoped>
.page-title {
  padding: 10px 16px;
  margin: 15px 0 5px;
}
.title-underline {
  margin: 0 15px;
}
.page-admin {
  padding-right: 30px;
  padding-top: 8px;
  margin-bottom: 8px;
  position: absolute;
  right: 0;
  z-index: 6;
  background: #fff;
  left: 0;
}
</style>
