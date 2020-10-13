<template>
  <s-modal
    :title="title" v-model="show" @ok="ok"
  >{{message}}</s-modal>
</template>
<script>
import Modal from '@/components/Modal'
export default {
  name: 'Confirm',
  components: {
    SModal: Modal
  },
  data () {
    return {
      show: false,
      title: '',
      message: '',
      hasClose: false,
      hasCancel: true,
      hasOk: true,
      okTxt: '确定',
      cancelTxt: '取消',
      handleSubmit: null,
      handleCancel: null
    }
  },
  mounted () {
    this.open()
  },
  methods: {
    open () {
      this.show = true
    },
    close () {
      this.show = false
    },
    ok () {
      this.handleSubmit && this.handleSubmit()
      this.close()
    },
    cancel () {
      this.handleCancel && this.handleCancel()
      this.close()
    },
    destroy () {
      this.$destroy(true)
    }
  }
}
</script>
