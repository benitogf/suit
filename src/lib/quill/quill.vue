<template>
  <div class="vue-quill">
    <h3 v-if="status !== ''" class="status active">{{ status }}</h3>
    <div ref="quill" :enaled="edit"
      @click.prevent="focusEditor">
    </div>
  </div>
</template>
<script>
// @flow
import _ from 'lodash'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { ImageDrop } from '@/lib/quill/formats/image-drop'
import wh from '@/lib/session'
import spinners from 'cli-spinners'
const freq = 80

if (!Quill.imports['modules/imageDrop']) {
  Quill.register({
    'modules/imageDrop': ImageDrop
  })
}

function loaderStart (self) {
  let loadSeq = spinners.dots12.frames
  let frame = 0
  if (!self.loading) {
    self.loading = setInterval(() => {
      self.status = loadSeq[frame]
      if (frame < loadSeq.length) {
        frame++
      } else {
        frame = 0
      }
    }, freq)
  }
  return self.loading
}

function loaderStop (self) {
  setTimeout(function () {
    clearInterval(self.loading)
    self.status = ''
    self.loading = null
  }, 600)
}

function debounce (inner, ms = 0) {
  let timer = null
  let resolves = []
  // https://stackoverflow.com/a/35228455

  return function (...args) {
    // Run the function after a certain amount of time
    clearTimeout(timer)
    timer = setTimeout(() => {
      // Get the result of the inner function, then apply it
      // to the resolve function of
      // each promise that has been created since the last
      // time the inner function was run
      let result = inner(...args)
      resolves.forEach(r => r(result))
      resolves = []
    }, ms)

    return new Promise((resolve) => resolves.push(resolve))
  }
}

async function getDelta (label) {
  try {
    let id = await wh.session.hash(label)
    let content = await wh.item.get(id) // read
    let index = 0
    var images = []
    for (let dt of content.data.ops) {
      let img = dt.insert.image
      if (img && img.indexOf('data:image') === -1) {
        let id = img
        images.push(id)
        let image
        try {
          image = await wh.item.get(id)
        } catch (e) {
          image = { data: '' }
        }
        content.data.ops[index].insert.image = image.data
      }
      index++
    }
    return { content, images }
  } catch (e) {
    return {}
  }
}

async function saveDelta (label, data) {
  let index = 0
  let images = []
  for (let dt of data.ops) {
    let img = dt.insert.image
    if (img && img.indexOf('data:image') === 0) {
      let id = await wh.session.hash(label + 'img' + img)
      try {
        await wh.item.create({ id, data: img })
        images.push(id)
        data.ops[index].insert.image = id
      } catch (e) {
        data.ops.slice(index, 1)
      }
    }
    index++
  }

  await wh.item.set({ label, data }) // write
  return images
}

async function updateTrash (label, images) {
  let store
  let trash
  try {
    let id = await wh.session.hash(label + ':images')
    store = await wh.item.get(id)
    trash = store.data.filter((nf) => images.indexOf(nf) === -1)
  } catch (e) {
    store = { data: images }
    trash = []
  }

  await wh.item.set({
    label: label + ':images',
    data: images.concat(trash)
  })
}

async function clean (label, images) {
  let id = await wh.session.hash(label + ':images')
  try {
    let trash = []
    let store = await wh.item.get(id)
    for (let img of store.data) {
      if (images.indexOf(img) === -1) {
        trash.push(img)
      }
    }
    if (trash.length > 0) {
      await wh.item.delSome(trash)
      await wh.item.set({ id, data: images })
    }
  } catch (e) {
    console.warn(e)
    await wh.item.set({ id, data: [] })
  }
}

export default {
  props: {
    formats: {
      type: Array,
      default () {
        return []
      }
    },
    edit: Boolean,
    output: {
      default: 'delta'
    },
    config: {
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      editor: {},
      status: '/',
      defaultConfig: {
        modules: {
          imageDrop: true,
          toolbar: {
            container: [
              [{ list: 'ordered' }, { list: 'bullet' }, { align: [false, 'center', 'right', 'justify'] }],
              ['bold', 'italic', 'underline'],
              ['image', 'print']
            ],
            init () {
              this.toolbarPrint = document.querySelectorAll('.ql-toolbar .ql-print')[0]
              if (this.toolbarPrint && this.toolbarPrint.innerHTML === '') {
                this.toolbarPrint.innerHTML = '<svg version="1.1" x="0px" y="0px" width="24px"height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g><g><g><path d="M19,8H5c-1.7,0-3,1.3-3,3v6h4v4h12v-4h4v-6C22,9.3,20.7,8,19,8z M16,19H8v-5h8V19z M19,12c-0.6,0-1-0.4-1-1s0.4-1,1-1c0.6,0,1,0.4,1,1S19.6,12,19,12z M18,3H6v4h12V3z" class="ql-fill"/></g><rect fill="none" width="24" height="24"/></g></g></svg>'
              }
            },
            handlers: {
              print () {
                window.print()
              }
            }
          }
        },
        theme: 'snow'
      }
    }
  },
  async mounted () {
    loaderStart(this)
    await wh.hub.upsert('public', 'public') // init
    if (this.$refs.quill) {
      this.editor = new Quill(this.$refs.quill,
        _.defaultsDeep(this.config, this.defaultConfig))
      this.editable(this.edit)
      this.$watch('edit', this.editable)
      let label = this.$el.id
      let delta = await getDelta(label)
      let content = delta.content
      let images = delta.images
      if (content) {
        this.editor.setContents(content.data)
      } else {
        this.editor.setContents('')
      }
      await clean(label, images)
      loaderStop(this)
      let update = debounce(async (delta, source) => {
        loaderStart(this)
        let label = this.$el.id
        let data = this.editor.getContents()
        let images = await saveDelta(label, data)
        updateTrash(label, images)
        loaderStop(this)
      }, freq * 15)
      this.editor.on('text-change', update)
    }
  },

  methods: {
    focusEditor (e) {
      if (e && e.srcElement) {
        let classList = e.srcElement.classList
        let isSegment = false
        classList.forEach((className) => {
          if (className === 'segment') {
            isSegment = true
            return
          }
        })

        if (!isSegment) return
      }

      this.editor.focus()
    },

    editable (enabled) {
      let quillToolbar = this.$el.querySelectorAll('.ql-toolbar')[0]
      if (!enabled) {
        this.editor.disable()
        if (quillToolbar) {
          quillToolbar.style = 'opacity:0;'
        }
      } else {
        this.editor.enable()
        quillToolbar.style = 'opacity:1;'
      }
    }
  }
}
</script>

<style lang="scss">
@media print {
  p {
    orphans: 4;
  }
  ol, ul {
    break-inside: avoid;
  }
  .ql-toolbar, .ql-toolbar * {
    display: none !important;
  }
  .ql-container, .ql-editor {
    padding: 0 !important;
    margin: 0 !important;
    height: auto !important;
    overflow: hidden !important;
    zoom: 0.99;
  }
}
.vue-quill {
  height: auto;
  min-height: 100%;
  padding: 50px;
  padding: 0;
  height: inherit;
  width: 100%;
  .ql-toolbar {
    z-index: 4;
    width: 100%;
    border: none !important;
  }
  .ql-container {
    height: calc(100% -40px);
    border: none;
    border: none !important;
    &.ql-disabled {
      padding-top: 0;
      .ql-editor {
        padding: 0;
        margin-bottom: 20px;
      }
    }
  }
  .ql-toolbar {
    border: none;
    box-shadow: 0px 1.6px 1.6px rgba(221, 221, 221, 0.71);
  }
  .ql-editor {
    font-size: 18px;
    overflow-y: scroll;
    padding: 12px 15px 70px 15px;
    &::-webkit-scrollbar-track {
      background-color: #FFFFFF;
    }

    &::-webkit-scrollbar {
      width: 10px;
      background-color: #FFFFFF;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #EFEFEF;
    }
  }
}
.status {
  &.active {
    background-color: white;
    color: black;
    z-index: 9;
  }
  padding-top: 13px;
  margin-left: 15px;
  padding-right: 5px;
  position: fixed;
  top: 0;
  width: 100%;
  height: 48px;
  color: white;
  background-color: transparent;
  margin: 0;
  right: 0;
  text-align: right;
  // pointer-events: none;
}
</style>
