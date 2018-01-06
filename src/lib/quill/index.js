// @flow
import QuillVue from '@/lib/quill/quill.vue'
// https://github.com/CroudSupport/vue-quill/tree/vue2
export default {
  install (Vue, options) {
    Vue.component('quill', QuillVue)
  }
}
