<template>
  <md-layout :class="{
    'product-margin': !showActions
    }">

    <md-dialog ref="bagForm" v-if="!edit || !isAdmin">
      <md-dialog-title>{{ product.name }}</md-dialog-title>
      <md-dialog-content>
        <md-layout md-align="end">
          <div class="md-subhead">{{ product.price | currency }}</div>
        </md-layout>
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
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="closeBagForm(false)">cancel</md-button>
        <md-button class="md-primary" @click="closeBagForm(true)">add to bag</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog ref="productForm" v-if="edit && isAdmin">
      <md-dialog-title>{{ product.name }}</md-dialog-title>
      <md-dialog-content>
        <form>
          <div class="md-title vars-title">Product Info</div>
          <md-input-container>
            <picture-input
              ref="pictureInput"
              @loaded="productPicture"
              width="600"
              height="600"
              margin="0"
              accept="image/jpeg,image/png,image/gif"
              size="10"
              buttonClass="md-button md-default"
              :customStrings="{
                upload: '<h1>Bummer!</h1>',
                drag: 'Drop or select 📷'
              }">
            </picture-input>
          </md-input-container>
          <md-input-container>
            <label>Name</label>
            <md-input v-model="product.name"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Price</label>
            <md-input v-model="product.basePrice"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Description</label>
            <md-textarea v-model="product.description" maxlength="70"></md-textarea>
          </md-input-container>
          <div class="md-title vars-title">Extras</div>
          <md-layout md-flex v-for="label in extras" :key="label" class="extra">
            <md-list>
              <md-list-item>
                <b>{{label}}</b>
                <md-layout md-align="end">
                  <md-button md-flex class="md-button md-icon-button md-primary" @click="extraForm(label, null)"><i class="material-icons">add_box</i></md-button>
                </md-layout>
              </md-list-item>
              <md-divider></md-divider>
              <md-list-item v-for="extra in product[label+'s']" :key="extra.label">
                <p>{{extra.label}}</p>
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

    <md-dialog ref="extraForm" v-if="edit && isAdmin">
      <md-dialog-title>{{ product.name + ' extra: ' + extraConfig.label }}</md-dialog-title>
      <md-dialog-content>
        <form v-if="extraConfig.label === 'var'">
          <md-input-container>
            <label>Label</label>
            <md-input v-model="extra.label"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Price</label>
            <md-input v-model="extra.price"></md-input>
          </md-input-container>
        </form>
        <form v-if="extraConfig.label === 'bulk'">
          <md-input-container>
            <label>Label</label>
            <md-input v-model="extra.label"></md-input>
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
        <md-button class="md-default" @click="closeExtraForm()">Cancel</md-button>
        <md-button v-if="extraConfig.action === 'add'" class="md-primary" @click="closeExtraForm()">add extra</md-button>
        <md-button v-if="extraConfig.action === 'edit'" class="md-primary" @click="closeExtraForm()">save</md-button>
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
        <md-layout>
          <div class="md-title">{{ product.name }}</div>
          <div class="md-subhead">{{ product.price | currency }}</div>
        </md-layout>
        <md-button v-if="!edit || !isAdmin" class="md-button md-raised md-primary"
          :disabled="!product.inventory"
          @click="bagForm()">add to bag</md-button>
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
          <img :src="product.picture" :alt="product.name">
        </router-link>
      </md-card-media>

      <md-card-content>
        <p class="product-view">{{ product.description }}</p>
      </md-card-content>
    </md-card>

  </md-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import router from '@/router'

function calculatePrice () {
  const price = this.product.vars ? this.product.vars.reduce((cat, {label, price}) => {
    if (label === this.product.var) {
      cat = price
    }
    return cat
  }, '') : this.product.basePrice
  const bulk = this.product.bulks ? this.product.bulks.reduce((cat, {label, factor}) => {
    if (label === this.product.bulk) {
      cat = factor
    }
    return cat
  }, '') : 1
  const quantity = this.product.bulks ? this.product.bulks.reduce((cat, {label, quantity}) => {
    if (label === this.product.bulk) {
      cat = quantity
    }
    return cat
  }, '') : 1
  this.product.price = price * bulk
  this.product.quantity = quantity
}

export default {
  name: 'Product',
  props: {
    product: Object,
    showActions: Boolean,
    edit: Boolean
  },
  data: () => ({
    extras: ['var', 'bulk'],
    extra: {},
    extraConfig: {
      label: 'var',
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
      user: 'currentUser',
      state: 'currentState',
      profile: 'profile',
      isAdmin: 'isAdmin'
    }),
    src () {
      return id => '../static/' + id + '.jpg'
    }
  },
  watch: {
    'product.var': calculatePrice,
    'product.bulk': calculatePrice,
    'product.basePrice': calculatePrice
  },
  methods: {
    ...mapActions([
      'addToBag'
    ]),
    productForm () {
      this.$refs.productForm.open()
    },
    closeProductForm () {
      this.$refs.productForm.close()
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
        this.extra = extra
      }
      this.$refs.extraForm.open()
    },
    closeExtraForm () {
      this.$refs.extraForm.close()
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
    remove () {
      switch (this.confirm.subject) {
        case 'product':
          this.$store.dispatch('removeProduct', this.product.id)
          if (this.state !== 'shop') {
            router.push({ name: 'shop' })
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
    const init = calculatePrice.bind(this)
    init()
  }
}
</script>
<style lang="scss" scoped>
.product-margin {
  display: block;
}

.md-title {
  font-size: 15px !important;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
}
.md-subhead {
  line-height: 32px;
  margin-left: 10px;
}

.extra ul {
  flex: 1;
}

.product {
  flex: 1;
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
  max-width: 628px;
  margin: 0 auto;
}
</style>
