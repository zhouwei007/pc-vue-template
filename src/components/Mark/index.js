import Mark from './src/mark'

Mark.install = Vue => {
  Vue.component(Mark.name, Mark)
}

export default Mark
