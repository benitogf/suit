<template>

  <md-list class="md-dense md-list-form">

    <md-list-item v-for="(section, index) in page[root]" :key="index" :class="'level'+level">

      <span class="label" v-html="section.id"></span>

      <md-list-expand :md-expand-multiple="true" :edit="edit && isAdmin" :mutating="mutating" v-if="page[section.id] instanceof Array">

        <md-toolbar v-if="edit && isAdmin" class="md-dense">
          <md-button class="md-primary md-raised" @click="action({ action: 'plus', root,  id: section.id })">
            <i class="material-icons">add_box</i>
          </md-button>

          <md-button class="md-raised" v-if="root === 'root'" @click="action({ action: 'sub', id: section.id })">
            <i class="material-icons">add_box</i>
            <i class="material-icons">subdirectory_arrow_right</i>
          </md-button>

          <md-layout md-align="end">
            <md-button class="md-accent md-raised" :disabled="section.data.length === 1" @click="action({ action: 'del', root,  id: section.id })">
              <i class="material-icons">remove_circle</i>
            </md-button>

            <md-button class="md-warn md-raised" @click="action({ action: 'sub', id: section.id })">
              <i class="material-icons">clear</i></md-icon>
            </md-button>
          </md-layout>

        </md-toolbar>

        <md-list-item v-for="(item, index) in section.data" :key="index" class="md-list-form-item">
          <quill @input="fire" v-model="section.data[index]" :id="section.parent + ':' + section.id + ':' + index" :edit="edit && isAdmin" class="quill-container"></quill>
        </md-list-item>

        <md-list-form :edit="edit"
          :level="level+1"
          @sub="action"
          @plus="action"
          @fire="fire"
          :root="section.id">
        </md-list-form>

      </md-list-expand>

    </md-list-item>

  </md-list>

</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'md-list-form',
    props: {
      level: Number,
      root: {
        type: String,
        default: 'root'
      },
      edit: Boolean,
      mutating: Boolean
    },
    computed: {
      ...mapGetters({
        isAdmin: 'isAdmin',
        page: 'page'
      })
    },
    data: () => ({
      debounce: false
    }),
    methods: {
      action (data) {
        if (!this.debounce && data) {
          this.$emit(data.action, data)
        }
      },
      fire () {
        this.$emit('fire')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .md-list-form-item {
    .md-list-item-container {
      padding: 0;
      &:hover,
      &:focus {
        background: #fff;
      }
    }
    .level0 {
      .label {
        font-size: 1.5rem;
      }
    }
    .level1 {
      margin-left: 4rem;
      .label {
        font-size: 1.1rem;
      }
    }
  }
  .material-icons {
    vertical-align: middle;
  }
</style>
