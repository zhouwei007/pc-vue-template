import AddItem from './src/addItem'

AddItem.install = Vue => {
  Vue.component(AddItem.name, AddItem)
}

export default AddItem
