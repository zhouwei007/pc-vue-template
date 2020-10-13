import Editor from './src/editor'

Editor.install = function (Vue) {
  Vue.component(Editor.name, Editor)
}

export default Editor
