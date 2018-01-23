<template>
  <div class="vue-quill">
    <div ref="quill" :enabled="edit" @click.prevent="focusEditor"></div>
  </div>
</template>
<script>
// @flow
import _ from 'lodash'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { ImageDrop } from '@/lib/quill/formats/image-drop'

if (!Quill.imports['modules/imageDrop']) {
  Quill.register({
    'modules/imageDrop': ImageDrop
  })
}

export default {
  model: {
    prop: 'content'
  },
  props: {
    content: {},
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
              ['image']
            ]
          }
        },
        theme: 'snow'
      }
    }
  },
  mounted () {
    this.editor = new Quill(this.$refs.quill,
      _.defaultsDeep(this.config, this.defaultConfig))
    this.editable(this.edit)
    this.$watch('edit', this.editable)
    if (this.content && this.content !== '') {
      if (this.output !== 'delta') {
        this.editor.pasteHTML(this.content)
      } else {
        this.editor.setContents(this.content)
      }
    }

    this.editor.on('text-change', _.debounce((delta, source) => {
      this.$emit('text-change', this.editor, delta, source)
      this.$emit('input', this.output !== 'delta' ? this.editor.root.innerHTML : this.editor.getContents())
    }, 600))
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
          quillToolbar.style = 'opacity:0;height:0;padding:0;'
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
    .ql-snow.ql-toolbar button:hover {
      color: #000 !important;
    }
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
        overflow-y: hidden;
      }
    }
    &:not(.ql-disabled) .ql-editor {
      border-left: 1px solid #4fb7ad;
      border-right: 1px solid #4fb7ad;
      border-bottom: 1px solid #4fb7ad;
    }
  }
  .ql-toolbar {
    border: none;
    box-shadow: 0px 1.6px 1.6px rgba(221, 221, 221, 0.71);
    background: rgba(0, 150, 136, 0.69);
  }
  .ql-editor {
    font-size: 18px;
    overflow-y: scroll;
    padding: 12px 15px 15px 15px;
    // box-shadow: 0px 1.6px 10.6px rgba(221, 221, 221, 0.71);
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
