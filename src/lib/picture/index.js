// @flow
import PictureInput from '@/lib/picture/picture.vue'
// https://github.com/alessiomaffeis/vue-picture-input
export default {
  install (Vue, options) {
    Vue.component('picture-input', PictureInput)
  }
}
