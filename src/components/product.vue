<template>
  <md-layout :class="{
    'product-margin': !showActions
    }">

    <md-dialog ref="bagForm" v-if="!edit || !isAdmin">
      <md-dialog-title>{{ product.name }}</md-dialog-title>
      <md-dialog-content>
        <form>
          <md-layout md-flex="100" v-if="product[extra+'s'] && product[extra+'s'].length > 1" v-for="extra in extras" :key="extra" class="extra">
            <md-input-container>
              <label :for="extra">{{extra}}</label>
              <md-select :name="extra" :id="extra" v-model="product[extra]">
                <md-option v-for="v in product[extra+'s']" :value="v.label" :key="v.label">{{v.label}}</md-option>
              </md-select>
            </md-input-container>
          </md-layout>
        </form>
        <md-layout md-align="end">
          <div class="md-subhead bag-price">{{ product.price | currency }}</div>
        </md-layout>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="closeBagForm(false)">
          <i class="material-icons">undo</i>
        </md-button>
        <md-button class="md-accent md-raised" @click="closeBagForm(true)">
          <i class="material-icons">local_mall</i>
          <i class="material-icons">check</i>
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog ref="productForm" v-if="edit && isAdmin" @close="onCloseProductForm">
      <md-dialog-title>{{ product.name }}</md-dialog-title>
      <md-dialog-content>
        <form>
          <div class="md-title vars-title">Product Info</div>
          <md-input-container>
            <picture-input
              ref="pictureInput"
              @loaded="productPicture"
              width="400"
              height="400"
              margin="0"
              accept="image/jpeg,image/png,image/gif"
              size="10"
              :prefill="product.picture"
              buttonClass="md-button md-default">
            </picture-input>
          </md-input-container>
          <md-input-container>
            <label>Name</label>
            <md-input v-model="product.name"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Price</label>
            <md-input readonly v-model="product.price"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Base Price</label>
            <md-input v-model="product.basePrice"></md-input>
          </md-input-container>
          <md-input-container>
            <label>inventory</label>
            <md-input v-model="product.inventory"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Description</label>
            <md-textarea v-model="product.description" maxlength="70"></md-textarea>
          </md-input-container>
          <!-- <page v-if="product.page && showActions" :id="product.id.toString()" :page="product.page"></page> -->
          <div class="md-title">Extras</div>
          <md-layout md-flex v-for="label in extras" :key="label" class="extra">
            <md-list>
              <md-list-item>
                <b class="vars-name">{{label}}</b>
                <md-layout md-align="end">
                  <md-button md-flex class="md-button md-icon-button md-primary" @click="extraForm(label, null)"><i class="material-icons">add_box</i></md-button>
                </md-layout>
              </md-list-item>
              <md-divider></md-divider>
              <md-list-item v-for="extra in product[label+'s']" :key="extra.label">
                <p class="vars-name">{{extra.label}}</p>
                <md-layout md-align="end">
                  <md-button class="md-button md-icon-button md-accent"
                    @click="extraForm(label, extra)"><i class="material-icons">mode_edit</i></md-button>
                  <md-button class="md-button md-icon-button md-warn"
                    @click="removeExtra(label, extra)"><i class="material-icons">delete_forever</i></md-button>
                </md-layout>
                <md-divider></md-divider>
              </md-list-item>
            </md-list>
          </md-layout>
        </form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="closeProductForm()">done</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog ref="extraForm" v-if="edit && isAdmin" @close="onCloseExtraForm">
      <md-dialog-title>{{ product.name + ' extra: ' + extraConfig.label }}</md-dialog-title>
      <md-dialog-content>
        <form v-if="extraConfig.label === 'variant'">
          <md-input-container>
            <label>Label</label>
            <md-input :readonly="extraConfig.action === 'edit'" v-model="extra.label"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Price</label>
            <md-input v-model="extra.price"></md-input>
          </md-input-container>
        </form>
        <form v-if="extraConfig.label === 'bulk'">
          <md-input-container>
            <label>Label</label>
            <md-input :readonly="extraConfig.action === 'edit'" v-model="extra.label"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Quantity</label>
            <md-input v-model="extra.quantity"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Factor</label>
            <md-input v-model="extra.factor"></md-input>
          </md-input-container>
        </form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="closeExtraForm()">done</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog-confirm
      :md-title="confirm.title"
      :md-content-html="confirm.contentHtml"
      :md-ok-text="confirm.ok"
      md-cancel-text="cancel"
      @close="onCloseConfirm"
      ref="removeConfirm">
    </md-dialog-confirm>

    <md-card class="md-default product" :class="{
        'product-view': !showActions
      }">
      <md-card-actions>
        <md-layout md-row>
          <div class="md-title product-title">{{ product.name }}</div>
          <div class="md-subhead product-price">{{ product.price | currency }}</div>
        </md-layout>
        <md-button v-if="!edit || !isAdmin" class="md-button md-raised md-primary"
          :disabled="notAvailable"
          @click="bagForm()">
          <i class="material-icons">local_mall</i>
          <i class="material-icons">exposure_plus_1</i>
        </md-button>
        <md-menu v-if="edit && isAdmin">
          <md-button class="md-icon-button md-primary" md-menu-trigger><i class="material-icons">more_vert</i></md-button>
          <md-menu-content>
            <md-menu-item class="md-accent" @click="productForm()">
              edit <i class="material-icons">mode_edit</i>
            </md-menu-item>
            <md-menu-item class="md-warn" @click="removeProduct()">
              remove <i class="material-icons">delete_forever</i>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </md-card-actions>

      <md-card-media>
        <router-link exact :to="'/product/'+product.id">
          <md-image v-if="product.picture" :md-src="product.picture" :alt="product.name"></md-image>
          <i v-else class="material-icons product-picture">wallpaper</i>
        </router-link>
      </md-card-media>

      <md-card-content :class="{
        'product-content': !showActions && isAdmin
        }">
        <p class="product-description">{{ product.description }}</p>
        <page @edit="editToggle" v-if="!showActions && product" :id="product.id.toString()"></page>
      </md-card-content>
    </md-card>

  </md-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Page from '@/components/page'

function calculatePrice () {
  const price = this.product.variants ? this.product.variants.reduce((cat, {label, price}) => {
    if (label === this.product.variant) {
      cat = price
    }
    return cat
  }, 1) : this.product.basePrice
  const bulk = this.product.bulks ? this.product.bulks.reduce((cat, {label, factor}) => {
    if (label === this.product.bulk) {
      cat = factor
    }
    return cat
  }, 1) : 1
  const quantity = this.product.bulks ? this.product.bulks.reduce((cat, {label, quantity}) => {
    if (label === this.product.bulk) {
      cat = quantity
    }
    return cat
  }, 1) : 1
  // console.log('calc', this.product.name, price, bulk, quantity)
  this.product.price = price * bulk
  this.product.quantity = quantity
}

export default {
  name: 'Product',
  components: { Page },
  props: {
    product: Object,
    showActions: Boolean,
    edit: Boolean
  },
  data: () => ({
    extras: ['variant', 'bulk'],
    extra: {},
    extraConfig: {
      label: 'variant',
      action: 'add'
    },
    confirm: {
      title: 'confirm',
      contentHtml: 'confirm',
      ok: 'ok'
    }
  }),
  computed: {
    ...mapGetters({
      state: 'currentState',
      profile: 'profile',
      isAdmin: 'isAdmin'
    }),
    notAvailable () {
      return parseInt(this.product.inventory) !== -1 && (parseInt(this.product.inventory) === 0 || parseInt(this.product.quantity) > parseInt(this.product.inventory))
    }
  },
  watch: {
    'product.variant': calculatePrice,
    'product.variants': calculatePrice,
    'product.bulk': calculatePrice,
    'product.bulks': calculatePrice,
    'product.basePrice': calculatePrice
  },
  methods: {
    ...mapActions([
      'addToBag',
      'addExtra',
      'alterExtra',
      'alterProduct'
    ]),
    calculatePrice,
    productForm () {
      this.$refs.productForm.open()
    },
    closeProductForm () {
      this.$refs.productForm.close()
    },
    onCloseProductForm () {
      this.alterProduct(this.product)
    },
    productPicture (e) {
      this.product.picture = e
    },
    bagForm () {
      this.$refs.bagForm.open()
    },
    closeBagForm (add) {
      this.$refs.bagForm.close()
      if (add) {
        this.addToBag(this.product)
      }
    },
    extraForm (label, extra) {
      this.extraConfig = {
        label,
        action: extra ? 'edit' : 'add'
      }
      if (!extra) {
        this.extra = {}
      } else {
        this.extra = { ...extra }
      }
      this.$refs.extraForm.open()
    },
    closeExtraForm () {
      this.$refs.extraForm.close()
    },
    onCloseExtraForm () {
      if (this.extraConfig.action === 'add' && this.extra.label) {
        if (this.product[this.extraConfig.label + 's'] && this.product[this.extraConfig.label + 's'].find(ex => ex.label === this.extra.label)) {
          console.log('This extra is already defined, please change the label to add it')
          return
        }
        this.addExtra({ id: this.product.id, label: this.extraConfig.label, extra: this.extra })
      }
      if (this.extraConfig.action === 'edit') {
        this.alterExtra({ id: this.product.id, label: this.extraConfig.label, extra: this.extra })
      }
      this.$nextTick(() => this.calculatePrice())
    },
    removeExtra (label, extra) {
      this.extraConfig = {
        label
      }
      this.extra = extra
      this.confirm = {
        subject: 'extra',
        title: 'Removal confirmation',
        contentHtml: 'Please confirm that you wish to remove the extra (' + label + ') <b>' + this.product.name + ' - ' + extra.label + '</b>',
        ok: 'OK remove the extra'
      }
      this.$refs.removeConfirm.open()
    },
    removeProduct () {
      this.confirm = {
        subject: 'product',
        title: 'Removal confirmation',
        contentHtml: 'Please confirm that you wish to remove <b>' + this.product.name + '</b>',
        ok: 'OK remove the product'
      }
      this.$refs.removeConfirm.open()
    },
    onCloseConfirm (response) {
      if (response === 'ok') {
        this.remove()
      }
    },
    editToggle (e) {
      this.$emit('edit', e)
    },
    remove () {
      switch (this.confirm.subject) {
        case 'product':
          this.$store.dispatch('removeProduct', this.product.id)
          if (this.state !== 'shop') {
            this.$router.push({ name: 'shop' })
          }
          break
        case 'extra':
          this.$store.dispatch('removeExtra', {
            id: this.product.id,
            label: this.extraConfig.label,
            extra: this.extra
          })
          break
        default:
      }
    }
  },
  mounted () {
    this.calculatePrice()
  }
}
</script>
<style lang="scss" scoped>
@import 'src/components/material/core/stylesheets/variables.scss';

.extra ul {
  flex: 1;
}

.product {
  .product-title {
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
  }
  .product-price {
    line-height: 32px;
    margin-left: 10px;
  }
  .product-picture {
    font-size: 13em;
    color: #ccc;
    background-color: rgba(0, 0, 0, .12);
    width: 100%;
    height: 1.5em;
    line-height: 1.5em;
    text-align: center;
  }
  &:not(.product-view) {
    flex: 1;
  }
  .md-card-media img {
    width: auto !important;
    display: flex;
    max-height: 628px;
  }
  .md-list-action {
    color: #8e8e8e;
  }
}

.product-view {
  overflow-y: hidden;
  min-width: 320px;
  margin-bottom: 30px;
  margin-top: 69px;
}

.product-margin {
  justify-content: center;
}

.bag-price {
  font-size: 21px;
  font-weight: bold;
}

.material-icons {
  vertical-align: middle;
}

.product-description {
  margin: 25px;
  font-style: italic;
}

.product-content {
  min-height: 138px;
  padding: 0;
}
.vars-name {
  font-size: .8em;
}
</style>
