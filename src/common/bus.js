import Vue from 'vue'
import store from '@/store'

const Bus = new Vue({ store })

export const EVENT = {
  LOGOUT: 'LOGOUT',
  ROUTE_ANIMATION: 'ROUTE_ANIMATION',
  HEADER_BUTTON_CLICK: 'HEADER_BUTTON_CLICK',
  INPUT_FOCUS: 'INPUT_FOCUS',
  INPUT_BLUR: 'INPUT_BLUR'
}

export default Bus
