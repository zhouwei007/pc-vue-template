import Address from './src/address'

Address.install = Vue => {
  Vue.component(Address.name, Address)
}

export default Address
