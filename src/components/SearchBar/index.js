import SearchBar from './src/bar.vue'
import SearchItem from './src/searchItem.vue'

SearchBar.install = Vue => {
  Vue.component(SearchBar.name, SearchBar)
}

SearchItem.install = Vue => {
  Vue.component(SearchItem.name, SearchItem)
}

export {
  SearchBar,
  SearchItem
}
