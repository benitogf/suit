import mdList from './mdList.vue'
import mdListItem from './mdListItem.js'
import mdListExpand from './mdListExpand.vue'
import mdListTheme from './mdList.theme'
import mdListTree from './presets/mdListTree.vue'
import mdListForm from './presets/mdListForm.vue'

export default function install (Vue) {
  Vue.component('md-list', mdList)
  Vue.component('md-list-item', mdListItem)
  Vue.component('md-list-expand', mdListExpand)
  Vue.component('md-list-tree', mdListTree)
  Vue.component('md-list-form', mdListForm)

  Vue.material.styles.push(mdListTheme)
}
