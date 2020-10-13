import Form from './src/form.vue'
import FormItem from './src/item.vue'

Form.install = Vue => {
  Vue.component(Form.name, Form)
}

FormItem.install = Vue => {
  Vue.component(FormItem.name, FormItem)
}

export {
  Form,
  FormItem
}
