<template>
  <div class="md-sidenav" :class="[themeClass, classes]" @keyup.esc="close" tabindex="0">
    <div class="md-sidenav-content">
      <slot></slot>
    </div>

    <md-backdrop class="md-sidenav-backdrop" @close="close" ref="backdrop"></md-backdrop>
  </div>
</template>

<script>
  import theme from '@/components/material/theme/mixin'

  export default {
    name: 'md-sidenav',
    data () {
      return {
        mdVisible: false
      }
    },
    mixins: [theme],
    props: {
      mdSwipeable: Boolean,
      mdSwipeThreshold: {
        type: Number,
        default: 15
      },
      mdSwipeDistance: {
        type: Number,
        default: 100
      }
    },
    computed: {
      classes () {
        return this.mdVisible && 'md-active'
      }
    },
    methods: {
      show () {
        this.open()
      },
      open () {
        this.mdVisible = true
        this.$el.focus()
        this.$emit('open')
      },
      close () {
        this.mdVisible = false
        this.$el.blur()
        this.$emit('close')
      },
      toggle () {
        if (this.mdVisible) {
          this.close()
        } else {
          this.open()
        }
      },
      isHorizontallyInside (positionX) {
        return positionX > 0 && positionX < this.mountedRect.left + this.mountedRect.width
      },
      isVerticallyInside (positionY) {
        return positionY > 0 && positionY < this.mountedRect.top + this.mountedRect.height
      },
      isFromStartWhenClosed (positionX) {
        if (this.mdVisible) {
          return true
        }

        return positionX < this.mdSwipeThreshold
      },
      handleTouchStart (event) {
        const positionX = event.touches[0].clientX - this.mountedRect.left
        const positionY = event.touches[0].clientY - this.mountedRect.top

        if (
          !this.isHorizontallyInside(positionX) ||
          !this.isVerticallyInside(positionY) ||
          !this.isFromStartWhenClosed(positionX)
        ) {
          return
        }

        this.initialTouchPosition = positionX
        this.canMove = true
      },
      handleTouchEnd () {
        this.canMove = false
        this.initialTouchPosition = null
      },
      handleTouchMove (event) {
        if (!this.canMove) {
          return
        }

        const positionX = event.touches[0].clientX

        const difference = this.mdVisible
          ? this.initialTouchPosition - positionX
          : positionX - this.initialTouchPosition

        const action = this.mdVisible
          ? 'close'
          : 'open'

        if (difference > this.mdSwipeDistance) {
          this[action]()
        }
      }
    },
    mounted () {
      if (!this.mdSwipeable) {
        return
      }

      this.mountedRect = this.$refs.backdrop.$el.getBoundingClientRect()
      this.initialTouchPosition = null
      this.canMove = false

      document.addEventListener('touchstart', this.handleTouchStart)
      document.addEventListener('touchend', this.handleTouchEnd)
      document.addEventListener('touchmove', this.handleTouchMove)
    },
    beforeDestroy () {
      if (!this.mdSwipeable) {
        return
      }

      document.removeEventListener('touchstart', this.handleTouchStart)
      document.removeEventListener('touchend', this.handleTouchEnd)
      document.removeEventListener('touchmove', this.handleTouchMove)
    }
  }
</script>
<style lang="scss" scoped>
@import '../core/stylesheets/variables.scss';

.md-sidenav {
  &.md-left .md-sidenav-content {
    left: 0;
    transform: translate3D(-100%, 0, 0);
    @media (min-width: $breakpoint-large + 1) {
      top: 0;
      pointer-events: auto;
      transform: translate3d(0, 0, 0) !important;
      box-shadow: $material-shadow-2dp;
    }
  }

  &.md-right .md-sidenav-content {
    right: 0;
    transform: translate3D(100%, 0, 0);
    width: 330px;
    @media (min-width: $breakpoint-xlarge + 1) {
      width: 430px;
    }
  }

  &.md-fixed {
    .md-sidenav-content,
    .md-sidenav-backdrop {
      position: fixed;
    }
  }

  .md-sidenav-content {
    width: $sidenav-width;
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    pointer-events: none;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    transition: $swift-ease-out;
    transition-property: transform;
    will-change: transform;
    display: flex;
    flex-flow: column;
    // overflow: hidden;
  }

  .md-backdrop {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    pointer-events: none;
    opacity: 0;
    transition: $swift-ease-in-out;
    transition-property: opacity;
    will-change: opacity;
  }
}

.md-sidenav.md-active {
  .md-sidenav-content {
    box-shadow: $material-shadow-16dp;
    pointer-events: auto;
    transform: translate3D(0, 0, 0);
    position: fixed;
  }

  .md-sidenav-backdrop {
    opacity: 1;
    pointer-events: auto;
  }
}

.md-backdrop {
  background-color: rgba(249, 249, 249, 0.87);
}

.md-toolbar {
  border-bottom: 1px solid rgba(#000, .12);
}

.logo {
  font-size: 1.8em;
  width: 100%;
  .md-icon {
    width: 111px;
    height: auto;
  }
  & > a {
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    color: inherit;
    text-decoration: none;

    &:hover {
      color: inherit;
      text-decoration: none;
    }
  }

  img {
    width: 160px;
    margin-bottom: 16px;
  }
}
</style>
