<script>
export default {
  name: 'TBody',
  props: {
    columns: {
      type: Object,
      default: () => {
        return {}
      }
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: [ Number, String ]
    }
  },
  render (createElement) {
    if (!this.columns.render) {
      this.columns.render = (h, obj) => {
        return h('div', {}, obj[this.columns.key])
      }
    }
    return this.columns.render(createElement, this.data, this.index)
  }
}
</script>
