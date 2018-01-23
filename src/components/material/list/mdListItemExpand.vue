<template>
  <li class="md-list-item md-list-item-expand" :class="classes">
    <div class="md-list-item-container" :class="{ 'md-button': !edit }">
      <slot></slot>

      <md-icon v-if="edit" md-src="down-arrow" class="md-list-expand-indicator">keyboard_arrow_down</md-icon>
    </div>

    <md-button v-if="edit" type="button" class="md-button-ghost" @click="toggleExpandList"></md-button>

    <div class="md-list-expand" ref="expand" :class="expandClasses" :style="expandStyles">
      <slot v-if="(active || !edit || tree) && !mutating" name="expand"></slot>
    </div>
  </li>
</template>

<script>
  import getClosestVueParent from '@/components/material/core/utils/getClosestVueParent'

  export default {
    name: 'md-list-item',
    props: {
      mdExpandMultiple: Boolean
    },
    data () {
      return {
        parentList: false,
        active: false,
        height: 0,
        contentObserver: null,
        transitionOff: true,
        edit: false,
        mutating: false,
        tree: false
      }
    },
    computed: {
      classes () {
        return {
          'md-disabled': !this.edit,
          'md-active': this.active || !this.edit
        }
      },
      expandClasses () {
        return {
          'md-transition-off': this.transitionOff
        }
      },
      expandStyles () {
        return {
          'margin-bottom': this.height
        }
      }
    },
    methods: {
      resetSiblings () {
        this.parentList.$children.forEach((child) => {
          if (child.$el !== this.$el && child.$el.classList.contains('md-list-item-expand')) {
            child.active = false
          }
        })
      },
      calculatePadding () {
        window.requestAnimationFrame(() => {
          this.height = -this.$el.scrollHeight + 'px'

          window.setTimeout(() => {
            this.transitionOff = false
          })
        })
      },
      toggleExpandList ($event) {
        if (!this.mdExpandMultiple) {
          this.resetSiblings()
        }

        this.calculatePadding()
        this.active = !this.active
        this.$emit('click', $event)
      },
      recalculateAfterChange () {
        this.transitionOff = true
        this.calculatePadding()
      },
      observeChildChanges () {
        this.contentObserver = new MutationObserver(this.recalculateAfterChange)
        this.contentObserver.observe(this.$refs.expand, {
          childList: true,
          characterData: true,
          subtree: true
        })
      }
    },
    mounted () {
      let grandPa = this.$parent.$parent
      if (grandPa.$el.classList.value.indexOf('md-list-form') !== -1) {
        this.edit = grandPa.$props.edit
        this.$watch('$parent.$parent.$props.edit', function (newVal) {
          this.edit = newVal
        })
        this.$watch('$parent.$parent.$props.mutating', function (newVal) {
          this.mutating = newVal
        })
      } else {
        this.edit = true
        this.tree = true
      }

      this.$nextTick(() => {
        if (this.$refs.expand) {
          this.parentList = getClosestVueParent(this.$parent, 'md-list')
          this.calculatePadding()
          this.observeChildChanges()
          window.addEventListener('resize', this.recalculateAfterChange)
        }
      })
    },
    beforeDestroy () {
      if (this.contentObserver) {
        this.contentObserver.disconnect()
      }

      window.removeEventListener('resize', this.recalculateAfterChange)
    }
  }
</script>
