<template>

  <md-list class="md-dense md-list-form">

    <md-list-item v-for="(field, index) in fields[root]" :key="index" :class="'level'+level">

      <span class="label" v-html="field.id"></span>
      <md-list-expand :edit="edit" v-if="fields[field.id] instanceof Array">

        <md-list-item class="md-list-form-plus" v-if="edit" @click="fireClickEvent({ action: 'plus', root,  id: field.id })">
          <md-icon md-src="tag"></md-icon>{{field.id}}
        </md-list-item>

        <md-list-item v-for="(item, index) in field.data" :key="index" class="md-list-form-item">
          <quill :id="field.id + index" :edit="!!user && edit" class="quill-container"></quill>
        </md-list-item>

        <md-list-form :edit="edit"
          :fields="fields"
          :level="level+1"
          @sub="fireClickEvent"
          @plus="fireClickEvent"
          :root="field.id">
        </md-list-form>

        <md-list-item v-if="edit && root === 'root'" @click="fireClickEvent({ action: 'sub', id: field.id })">
          <md-icon md-src="tag"></md-icon>{{field.id}}
        </md-list-item>

      </md-list-expand>

    </md-list-item>

    <md-list-item v-if="edit && root === 'root' && !!user" @click="fireClickEvent({ action: 'sub' })">
      <md-icon md-src="tag"></md-icon>
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
        user: 'currentUser'
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
</style>
