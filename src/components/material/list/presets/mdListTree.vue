<template>

  <md-list class="md-dense">

    <md-list-item v-for="(tag, index) in tags[tag]" :key="index" class="md-list-tree-item">

      <span v-if="edit" v-html="tag"></span>
      <router-link v-if="!edit" exact :to="'/tag/' + tag" v-html="tag"></router-link>
      <md-list-expand :edit="true" v-if="tags[tag] instanceof Array">

          <md-list-tree :edit="edit"
            :tags="tags"
            @action="fireClickEvent"
            :tag="tag">
          </md-list-tree>

      </md-list-expand>

    </md-list-item>

    <md-list-item v-if="edit" v-for="(tag, index) in tags[tag]" :key="index+tag"
      @click="fireClickEvent(tag)">
      <md-icon md-src="tag"></md-icon>{{tag}}
    </md-list-item>

    <md-list-item v-if="edit && tag === 'root'" @click="fireClickEvent()">
      <md-icon md-src="tag"></md-icon>
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
      fireClickEvent (type) {
        if (!this.debounce) {
          this.$emit('action', type)
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
