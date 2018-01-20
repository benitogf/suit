<template>

  <md-list class="md-dense">

    <md-list-item v-for="(tag, index) in tags[tag]" :key="index" class="md-list-tree-item">

      <span v-if="edit" v-html="tag"></span>
      <md-layout v-if="edit" md-align="end">
        <md-button @click="action('add', tag)" class="md-primary md-icon-button"><i class="material-icons">add_circle</i></md-button>
        <md-button @click="action('del', tag)" class="md-warn md-icon-button"><i class="material-icons">remove_circle</i></md-button>
      </md-layout>
      <router-link v-if="!edit" exact :to="'/tag/' + tag" v-html="tag"></router-link>
      <md-list-expand :edit="true" v-if="tags[tag] instanceof Array">

          <md-list-tree :edit="edit"
            :tags="tags"
            @action="action"
            :tag="tag">
          </md-list-tree>

      </md-list-expand>

    </md-list-item>

  </md-list>

</template>

<script>
  export default {
    name: 'md-list-tree',
    props: {
      tags: {
        type: Object,
        required: true
      },
      tag: {
        type: String,
        default: 'root'
      },
      edit: Boolean
    },
    data: () => ({
      debounce: false
    }),
    methods: {
      action (action, type) {
        if (!this.debounce) {
          this.$emit(action, type)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.md-list-tree-item a {
  margin: 0;
}
.md-list-expand-container ul li {
  & > div span {
    margin: 0 16px;
  }
  & > a {
    margin: 0 16px;
  }
}
</style>
