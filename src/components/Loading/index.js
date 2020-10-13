import Vue from 'vue'
import SLoading from './src/load'

class Loading {
  constructor () {
    this.instance = null
  }

  open (options = {}) {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    if (this.instance) {
      this.instance.message = options.message || this.instance.message
      this.instance.top = options.top || this.instance.top
      return this.instance
    }
    this.instance = this._loadingFactory(options)
    options.parentNode ? options.parentNode.appendChild(this.instance.$mount().$el) : document.body.appendChild(this.instance.$mount().$el)
    return this.instance
  }

  close () {
    if (this.instance) {
      this.instance.close()
      this.instance = null
    }
  }

  _loadingFactory (options) {
    const LoadingConstructor = Vue.extend(SLoading)
    return new LoadingConstructor({
      data: options
    })
  }
}

export default new Loading()
