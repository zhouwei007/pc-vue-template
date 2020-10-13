import Vue from 'vue'
import Utils from '@/common/utils'

Vue.filter('money', (value, fixed = 2, unit = 'cent') => Utils.formatMoney(value, fixed, unit))