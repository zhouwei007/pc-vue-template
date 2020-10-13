<template>
  <div class="sass-datapicker">
    <div class="label">{{label}}</div>
    <datepicker
      format="yyyy-MM-dd"
      :language="zh"
      v-model="start"
      :clearButton="isClear"
      clearButtonIcon="close hl-icon hl-icon-round-close-fill"
      :placeholder="startholder"
      @selected="selectStart"
    ></datepicker>
    <div class="middle"></div>
    <datepicker
      v-model="end"
      format="yyyy-MM-dd"
      :language="zh"
      :clearButton="isClear"
      clearButtonIcon="close hl-icon hl-icon-round-close-fill"
      :placeholder="endholder"
      :disabled="enddisabled"
      @selected="selectEnd"
    ></datepicker>
  </div>
</template>
<script>
import Datepicker from 'vuejs-datepicker'
import { zh } from 'vuejs-datepicker/dist/locale'
export default {
  name: 'DatePicker',
  components: {
    Datepicker
  },
  data () {
    return {
      start: null,
      end: null,
      zh: zh,
      timeDate: {
        start: null,
        end: null
      }
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: true
    },
    startholder: {
      type: String,
      default: '请选择开始时间'
    },
    endholder: {
      type: String,
      default: '请选择结束时间'
    },
    startdisabled: {
      type: Boolean,
      default: false
    },
    enddisabled: {
      type: Boolean,
      default: false
    },
    time: {
      type: Object
    }
  },
  model: {
    prop: 'time',
    event: 'update:time'
  },
  watch: {
    time: function (val) {
      if (!val.start && !val.end) {
        this.start = ''
        this.end = ''
      }
    }
  },
  methods: {
    selectStart (time) {
      this.timeDate.start = new Date(time).getTime()
      this.$emit('startChange', time)
      this.$emit('update:time', this.timeDate)
    },
    selectEnd (time) {
      this.timeDate.end = new Date(time).getTime()
      this.$emit('endChange', time)
      this.$emit('update:time', this.timeDate)
    }
  }
}
</script>
<style lang="scss" scoped>
  .sass-datapicker::v-deep{
    display: flex;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #333333;
    .label{
      padding-right: 10px;
    }
    .middle{
      width: 9px;
      height: 1px;
      background: #333;
      margin: 15px 11px;
    }
    .vdp-datepicker{
      input{
        height: 30px;
        line-height: 32px;
        width: 150px;
        padding-left:10px;
        border:$border;
        border-radius: $component-border-radius;
      }
      .vdp-datepicker__clear-button{
        position: absolute;
        height: 30px;
        width: 29px;
        right: 0;
        text-align: center;
        color:#bfbfbf;
        &:hover{
          color: #8c8c8c;
        }
      }
    }
    .vdp-datepicker__calendar .cell.selected{
      background: #eee;
    }
    .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover, .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover, .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover{
      border: 1px solid #eee;
    }
  }
</style>
