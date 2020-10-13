import Radio from './src/radio'
import RadioGroup from './src/radioGroup'

Radio.install = Vue => {
  Vue.component(Radio.name, Radio)
}
RadioGroup.install = Vue => {
  Vue.component(RadioGroup.name, RadioGroup)
}

export {
  Radio,
  RadioGroup
}
