<template>
  <div class="sass-tables">
    <table>
      <thead>
        <tr>
          <th
            v-for="(item, index) in columns"
            :key="index"
            :width="item.width"
            :class="[item.classnames, `table-${item.align || 'center'}`]"
            :style="item.style"
            @click="sort(item, index)"
          >
            <div class="table-title" :style="{ 'width': `${item.width}px` }">
              <span>{{item.title}}</span>
              <div v-if="item.sortable" class="arrow">
                <i class="arrow-up" :class="{'active': status[index] === 'ASC'}"></i>
                <i class="arrow-down" :class="{'active': status[index] === 'DESC'}"></i>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td :colspan="columns.length" v-if="source.length === 0">
            <div class="table-no-data">暂无数据</div>
          </td>
        </tr>
        <tr v-if="isLoading">
          <td :colspan="columns.length">
            <div class="table-loading">
              <s-loading :show="isLoading"></s-loading>
            </div>
          </td>
        </tr>
        <template v-if="!isLoading">
          <tr v-for="(col, i) in source" :key="i">
            <td
              v-for="(item, index) in columns"
              :key="index"
              :width="item.width"
              :class="[item.classnames, `table-${item.align || 'center'}`]"
            >
              <s-radio v-if="item.type === 'radio'" v-model="col.radioVal" :value="false" @click="changeRadio(col)" />
              <s-checkbox
                v-if="item.type === 'checkbox'"
                v-model="col.checkVal"
                :value="false"
                @change="(val) => { changeCheck(val, col) }"
              ></s-checkbox>
              <slot :name="item.slotName" v-if="item.slotName" v-bind:row="{item: col, index: i}"></slot>
              <t-body v-if="!item.slotName"
                :columns="item"
                :data="col"
                :index="i"
              />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import TBody from './body'
import { Radio } from '@/components/RadioGroup'
import { Checkbox } from '@/components/checkbox'
import Loading from './loading'
export default {
  name: 'Table',
  data () {
    return {
      status: [],
      sortCurrent: null,
      selects: []
    }
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    source: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    selectId: {
      type: String,
      default: 'taskId'
    }
  },
  components: {
    TBody,
    SRadio: Radio,
    SCheckbox: Checkbox,
    SLoading: Loading
  },
  mounted () {
    this.sortCurrent = null
    this.status = Array.apply(null, new Array(this.columns.length))
    this.selects = []
  },
  watch: {
    isLoading: function (val) {
      if (val) {
        this.selects = []
      }
    }
  },
  methods: {
    sort (item, index) {
      if (!item.sortable) return
      this.sortCurrent = index
      let status = this.status[index]
      this.status = Array.apply(null, new Array(this.columns.length))
      switch (status) {
        case undefined:
          this.$set(this.status, index, 'ASC')
          break
        case 'ASC':
          this.$set(this.status, index, 'DESC')
          break
        case 'DESC':
          this.$set(this.status, index, 'ASC')
          break
      }
      item.sortFn && item.sortFn(item, this.status[index])
    },
    changeRadio (current) {
      this.source.map((item) => {
        item.radioVal = false
      })
      current.radioVal = true
      this.$forceUpdate()
      this.$emit('radioChange', current)
    },
    changeCheck (val, current = {}) {
      let isHas = this.selects.includes(current[this.selectId])
      if (val && !isHas) {
        this.selects.push(current[this.selectId])
      }
      if (!val && isHas) {
        let index = this.selects.indexOf(current[this.selectId])
        this.selects.splice(index,1)
      }
      this.$emit('selectChange', this.selects)
    }
  }
}
</script>

<style lang="scss" scoped>
.sass-tables::v-deep{
  width: 100%;
  overflow-x:auto;
  table{
    width: 100%;
    border: 1px #ECECEC solid;
    td,th{
      border-color:#ECECEC;
      border-style: solid;
      border-width: 0 1px 1px 0;
      &:last-child{
        border-right: none;
      }
    }
    th{
      height: 40px;
      line-height: 40px;
      background: #FAFAFA;
      font-size: 12px;
      font-weight: bold;
      color:#333;
      text-align: center;
      &.table-center{
        .table-title{
          justify-content:center;
          display: flex;
        }
      }
      &.table-right{
        .table-title{
          justify-content:flex-end;
          display: flex;
        }
      }
      .arrow{
        height: 10px;
        width: 8px;
        display: flex;
        flex-direction: column;
        margin-top:10px;
        margin-left:5px;
        .arrow-up{
          width: 0;
          height: 0;
          font-size: 0;
          border-width: 4px;
          border-style: dashed dashed solid;
          border-color: transparent transparent #BBBBBB;
          margin-bottom: 2px;
          &.active{
            border-color: transparent transparent #6975C9;
          }
        }
        .arrow-down{
          width: 0;
          height: 0;
          font-size: 0;
          border-width: 4px;
          border-style: dashed dashed solid;
          border-color: #BBBBBB transparent transparent;
          &.active{
            border-color: #6975C9 transparent transparent;
          }
        }
      }
    }
    td{
      height: 50px;
      line-height: 50px;
      font-size: 12px;
      color: #333333;
    }
    .table-title{
      >span{
        float: left;
      }
      &:before,
      &:after {
          content: " "; // 1
          display: table; // 2
      }
      &:after {
          clear: both;
      }
      zoom:1;
    }
  }
  .table-left{
    text-align: left;
  }
  .table-right{
    text-align: right;
  }
  .table-center{
    text-align: center;
  }
  .table-no-data{
    width: 100%;
    min-height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .table-loading{
    position: relative;
    min-height: 500px;
  }
  .opera{
    > a{
      color:#6975C9;
      padding: 0 5px;
      cursor: pointer;
    }
    >span{
      color: #ccc;
    }
  }
}
</style>
