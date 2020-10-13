<template>
  <div>
    <div>原办理人：{{origAssignee}}</div>
    <s-group
      v-for="(item, index) in data"
      :key="index"
      :title="item.orgName"
      :source="item.users"
      :index="index"
      :status="status"
      v-model="item.show"
      @change="setShowList"
      @select="radioSelect"
    ></s-group>
    <s-form>
      <form-item label="操作备注">
        <s-input
          v-model="note"
          @change="setNote"
          placeholder=""
          :required="true"
        />
      </form-item>
    </s-form>
  </div>
</template>

<script>
import Group from './group'
import { Form, FormItem } from '@/components/Form/index'
import Input from '@/components/Input'
export default {
  name: 'group',
  components: {
    SGroup: Group,
    SForm: Form,
    FormItem,
    SInput: Input
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    value: {
      type: Object,
      default: () => { return {} }
    },
    data: {
      type: Array,
      default: () => {}
    },
    origAssignee: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      note: '',
      params: {},
      status: {}
    }
  },
  created () {
    this.status = {}
  },
  methods: {
    setShowList (index) {
      this.$emit('setShow', index)
      // this.data.map((item) => {
      //   item.show = false
      // })
      // current.show = true
    },
    radioSelect (col) {
      this.params.assignee = col.userCode
      this.$emit('update:value', this.params)
    },
    setNote () {
      this.params.note = this.note
      this.$emit('update:value', this.params)
    }
  }
}
</script>
