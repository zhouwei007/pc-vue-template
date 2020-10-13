<template>
  <div class="task-modal-list">
    <div class="modal-title" @click="setShow" :style="{'marginBottom': value ? '10px' : '20px'}">
      <i class="icon hl-icon hl-icon-square-minus" v-if="value" ></i>
      <i class="icon hl-icon hl-icon-square-plus" v-else></i>
      <p class="title">
        <span>{{title}}</span>
        <span class="num">({{source.length}}人)</span>
      </p>
    </div>
    <div class="table-box" v-if="value">
      <s-table :columns="columns" :source="source">
        <template v-slot:radio="{ row }">
          <s-radio v-model="status[`tableStatus${index}${row.index}`]" @update:value="changeRadio({ index, i: row.index }, row.item)" />
        </template>
      </s-table>
    </div>
  </div>
</template>

<script>
import Table from '@/components/Table'
import { Radio } from '@/components/RadioGroup'
export default {
  name: 'group',
  components: {
    STable: Table,
    SRadio: Radio
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    source: {
      type: Array,
      default: () => []
    },
    status: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      columns: [
        {
          title: '',
          width: 40,
          // type: 'radio',
          slotName: 'radio'
        },
        {
          title: '用户账号',
          width: 158,
          render: (h, obj) => {
            return h('div', {}, obj.userCode)
          }
        },
        {
          title: '用户姓名',
          width: 158,
          render: (h, obj) => {
            return h('div', {}, obj.displayName)
          }
        },
        {
          title: '当前待办任务数',
          width: 158,
          render: (h, obj) => {
            return h('div', {}, obj.pendingTaskCount)
          }
        }
      ],
      show: false
    }
  },
  methods: {
    setShow () {
      this.$emit('update:value', !this.value)
      this.$emit('change', this.index)
    },
    changeRadio ({ index, i }, col) {
      Object.keys(this.status).map((item) => {
        this.status[item] = false
      })
      this.status[`tableStatus${index}${i}`] = true
      this.$forceUpdate()
      this.$emit('select', col)
    }
  }
}
</script>
<style lang="scss" scoped>
  .task-modal-list{
    width: 100%;
    .modal-title{
      display: flex;
      margin-bottom: 10px;
      cursor: pointer;
      .icon{
        display: block;
        width: 13px;
        height: 13px;
        line-height:13px;
        margin-right: 6px;
        &.hl-icon-square-minus{
          color:#6975C9
        }
        &.hl-icon-square-plus{
          color:#E2E6ED;
        }
      }
      .title{
        font-size: 14px;
        color: #333333;
        line-height: 13px;
        margin-bottom: 0px;
        .num{
          padding-left: 5px;
        }
      }
    }
    .table-box{
      margin-bottom: 20px;
      max-height: 200px;
      overflow-y: auto;
    }
  }
</style>
