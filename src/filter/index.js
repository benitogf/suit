import Vue from 'vue'
import { currency } from './currency'

Vue.filter('currency', currency)

export default {
  currency
}
