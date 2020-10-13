<template>
  <div class="multi-select">
    <Input
      class="search"
      placeholder="请输入"
      @change="match($event)"
    />
    <div class="select">
      <div class="box-left">
        <div
          v-for="(item, index) in src"
          :class="{item: true, selected: leftTemp.indexOf(index) > -1}"
          :key="index"
          @click="selectItem(index)"
        >{{item.label}}</div>
      </div>
      <div class="move-box">
        <Button type="default" class="right-all" @click="moveRightAll">>>>></Button>
        <Button type="default" class="right" @click="moveRight">>></Button>
        <Button type="default" class="left" @click="moveLeft">&lt;&lt;</Button>
        <Button type="default" class="left-all" @click="moveLeftAll">&lt;&lt;&lt;&lt;</Button>
      </div>
      <div class="box-right">
        <div
          v-for="(item, index) in des"
          :class="{item: true, selected: rightTemp.indexOf(index) > -1}"
          :key="index"
           @click="selectItem(index, true)"
        >{{item.label}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Input from '@/components/Input'
import Button from '@/components/Button'
export default {
  name: 'Selector',
  components: {
    Input,
    Button
  },
  props: {
    srcList: {
      type: Array,
      default: () => {
        return []
      }
    },
    desList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      src: this.srcList.length > 0 ? this.srcList: [],
      des: this.desList.length > 0 ? this.desList: [],
      leftTemp: [],
      rightTemp: []
    }
  },
  watch: {
    desList: function (newValue) {
      this.des = this.desList.length > 0 ? newValue: []
    },
    srcList: function (newValue) {
      this.src = this.srcList.length > 0 ? newValue: []
    }
  },
  methods: {
    selectItem: function(index, isRight = false) {
      let tempList = this.leftTemp
      if (isRight) {
        tempList = this.rightTemp
      }
      if (tempList.indexOf(index) > -1) {
        tempList.splice(tempList.indexOf(index), 1)
      } else {
        tempList.push(index)
      }
    },
    moveRight: function() {
      this.leftTemp.map((index) => {
        this.des.push(this.src[index])
      })
      this.src = this.src.filter((item, index) => {
        return this.leftTemp.indexOf(index) === -1
      })
      this.leftTemp = []
      this.$emit('desChange', this.des)
      
    },
    moveRightAll: function() {
      this.des.push(...this.src)
      this.src.splice(0)
      this.leftTemp = []
      this.$emit('desChange', this.des)
    },
    moveLeft: function() {
      this.rightTemp.map((index) => {
        this.src.push(this.des[index])
      })
      this.des = this.des.filter((item, index) => {
        return this.rightTemp.indexOf(index) === -1
      })
      this.rightTemp = []
      this.$emit('desChange', this.des)
    },
    moveLeftAll: function() {
      this.src.push(...this.des)
      this.des.splice(0)
      this.rightTemp = []
      this.$emit('desChange', this.des)
    },
    match: function(e) {
      let val = e.target.value
      this.src = this.srcList.filter(item => {
        return item.label.match(val)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.multi-select {
  .select {
    display: flex;
    margin: 10px 0;
    .box-left,.box-right {
      width: 160px;
      height: 150px;
      border: 1px solid #E2E6ED;
      overflow-y: scroll;
      .item {
        height: 28px;
        line-height: 28px;
        padding-left: 10px;
        font-size: 14px;
        cursor: pointer;
        color: #333333;
        &.selected {
          background: $primary-color;
          color: #ffffff;
        }
      }
    }
  }
  .move-box {
    padding: 0 30px;
    height: 150px;
    >button {
      margin-bottom: 10px;
    }
    .left-all {
      margin-bottom: 0px;
    }
  }
}
</style>