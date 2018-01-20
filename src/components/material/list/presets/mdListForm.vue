<template>

  <md-list class="md-dense md-list-form">

    <md-list-item v-for="(field, index) in fields[root]" :key="index" :class="'level'+level">

      <span class="label" v-html="field.id"></span>

      <md-list-expand :md-expand-multiple="true" :edit="edit && isAdmin" v-if="fields[field.id] instanceof Array">

        <md-toolbar v-if="edit" class="md-dense">
          <md-button class="md-primary md-raised" v-if="edit && isAdmin" @click="fireClickEvent({ action: 'plus', root,  id: field.id })">
            <i class="material-icons">add_box</i>
          </md-button>

          <md-button class="md-accent md-raised" v-if="edit && isAdmin" @click="fireClickEvent({ action: 'del', root,  id: field.id })">
            <i class="material-icons">remove_circle</i>
          </md-button>

          <md-button class="md-raised" v-if="edit && root === 'root' && isAdmin" @click="fireClickEvent({ action: 'sub', id: field.id })">
            <i class="material-icons">add_box</i></md-icon><i class="material-icons">subdirectory_arrow_right</i>
          </md-button>

          <md-button md-align="end" class="md-warn md-raised" v-if="edit && isAdmin" @click="fireClickEvent({ action: 'sub', id: field.id })">
            <i class="material-icons">clear</i></md-icon>
          </md-button>

        </md-toolbar>

        <md-list-item v-for="(item, index) in field.data" :key="index" class="md-list-form-item">
          <quill @input="fire" v-model="field.data[index]" :id="field.parent + ':' + field.id + ':' + index" :edit="edit && isAdmin" class="quill-container"></quill>
        </md-list-item>

        <md-list-form :edit="edit"
          :fields="fields"
          :level="level+1"
          @sub="fireClickEvent"
          @plus="fireClickEvent"
          @fire="fire"
          :root="field.id">
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
      fields: {
        type: Object,
        required: true
      },
      root: {
        type: String,
        default: 'root'
      },
      edit: Boolean
    },
    computed: {
      ...mapGetters({
        isAdmin: 'isAdmin'
      })
    },
    data: () => ({
      debounce: false
    }),
    methods: {
      fireClickEvent (data) {
        console.log(data)
        if (!this.debounce && data) {
          console.log(data)
          this.$emit(data.action, data)
        }
      },
      fire () {
        console.log('fire')
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
