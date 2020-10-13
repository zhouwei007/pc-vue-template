<template>
  <div class="unable">
    <Table
      :columns="columns"
      :source="source"
    />
  </div>
</template>
<script>
import Table from '@/components/Table'
import Utils from '@/common/utils'
export default {
  template: '.unable',
  components: {
    Table
  },
  data () {
    return {
      columns: [],
      source: []
    }
  },
  props: {
    headerList: {
      type: Array,
      default: () => []
    },
    keyList: {
      type: Array,
      default: () => []
    },
    originsour: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    init: function () {
      this.columns = []
      this.source = []
      let timeQueue = []
      this.keyList.map((key, index) => {
        let item = {}
        item.title = this.headerList[index]
        item.key = key
        this.columns.push(item)
        // 时间戳需要特殊处理
        if (key.indexOf('Time') > 0) {
          timeQueue.push(key)
        }
      })
      this.originsour.map((item) => {
        timeQueue.map((option) => {
          item[option] = Utils.fmtTime(item[option], 'yyyy-MM-dd hh:mm:ss')
        })
        this.source.push(item)
      })
      // 添加序号列
      // let serial = {
      //   title: '#',
      //   key: 'index'
      // }
      // this.columns.unshift(serial)
      // this.originsour.map((item, index) => {
      //   item.index = index
      //   this.source.push(item)
      // })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='scss' scope></style>
