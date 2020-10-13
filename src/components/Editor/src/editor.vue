<template>
  <div id="wangeditor">
    <div ref="editorElem" class="editorElem" />
    <div class="disabled" v-if="disabled"></div>
  </div>
</template>

<script>
import Editor from 'wangeditor'
export default {
  name: 'Editor',
  data () {
    return {
      editor: null,
      editorContent: '',
      isChange: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    menus: {
      type: Array,
      default: () => [
        'head',
        'bold',
        'fontSize',
        'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'foreColor',
        'backColor',
        'link',
        'list',
        'justify'
      ]
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (val) {
      if (!this.isChange) {
        this.editor.txt.html(val)
      }
      this.isChange = false
    }
  },
  mounted () {
    this.init()
    this.editor.txt.html(this.value)
  },
  methods: {
    init () {
      this.editor = new Editor(this.$refs.editorElem)
      this.editor.customConfig.onchange = html => {
        this.isChange = true
        this.editorContent = html
        this.$emit('change', this.editorContent)
      }
      this.editor.customConfig.menus = this.menus
      this.editor.create()
    }
  }
};
</script>

<style lang="scss" scoped>
.editorElem::v-deep {
  text-align: left;
  height:200px;
  max-height:300px;
  .w-e-text-container{
    position: inherit;
    height: 200px !important;
    border: 1px solid #E2E6ED;
    border-top: none;
    .w-e-text{
      font-size: 14px;
    }
    .w-e-toolbar{
      border: 1px solid #E2E6ED !important;
    }
  }
}
#wangeditor{
  position: relative;
  .disabled{
    width: 100%;
    height: 200px;
    position: absolute;
    top: 0;
    background: #eee;
    opacity: 0.2;
  }
}

</style>
